import { Pool } from "pg";
import type { IntakeAnswers } from "@/lib/intake-options";
import type { IntakeClassification } from "@/lib/intake-analysis";

export type IntakeFile = {
  name: string;
  mimeType: string;
  size: number;
  content: Buffer;
};

export type StoredIntake = {
  id: string;
  createdAt: Date;
  answers: IntakeAnswers;
  classification: IntakeClassification;
  files: IntakeFile[];
};

declare global {
  var lynexIntakePool: Pool | undefined;
  var lynexIntakeSchema: Promise<void> | undefined;
}

function pool() {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) throw new Error("DATABASE_URL is not configured");
  if (!global.lynexIntakePool) {
    global.lynexIntakePool = new Pool({
      connectionString,
      max: Number(process.env.DATABASE_POOL_SIZE || 5),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
  }
  return global.lynexIntakePool;
}

export async function ensureIntakeSchema() {
  if (!global.lynexIntakeSchema) {
    global.lynexIntakeSchema = pool().query(`
      CREATE TABLE IF NOT EXISTS lynex_intake_requests (
        id varchar(32) PRIMARY KEY,
        created_at timestamptz NOT NULL DEFAULT now(),
        contact_name varchar(80) NOT NULL,
        contact_email varchar(254) NOT NULL,
        source_hash varchar(128),
        answers jsonb NOT NULL,
        classification jsonb NOT NULL
      );
      CREATE INDEX IF NOT EXISTS lynex_intake_source_recent
        ON lynex_intake_requests (source_hash, created_at DESC);

      CREATE TABLE IF NOT EXISTS lynex_intake_files (
        id bigserial PRIMARY KEY,
        request_id varchar(32) NOT NULL REFERENCES lynex_intake_requests(id) ON DELETE CASCADE,
        file_name varchar(255) NOT NULL,
        mime_type varchar(120) NOT NULL,
        byte_size integer NOT NULL,
        content bytea NOT NULL
      );
      CREATE INDEX IF NOT EXISTS lynex_intake_files_request
        ON lynex_intake_files (request_id);

      CREATE TABLE IF NOT EXISTS lynex_intake_outbox (
        request_id varchar(32) PRIMARY KEY REFERENCES lynex_intake_requests(id) ON DELETE CASCADE,
        status varchar(20) NOT NULL DEFAULT 'pending',
        attempts integer NOT NULL DEFAULT 0,
        next_attempt_at timestamptz NOT NULL DEFAULT now(),
        locked_at timestamptz,
        sent_at timestamptz,
        provider_id varchar(120),
        last_error text
      );
      CREATE INDEX IF NOT EXISTS lynex_intake_outbox_due
        ON lynex_intake_outbox (status, next_attempt_at);
    `).then(() => undefined).catch((error) => {
      global.lynexIntakeSchema = undefined;
      throw error;
    });
  }
  return global.lynexIntakeSchema;
}

export async function isRateLimited(sourceHash: string) {
  await ensureIntakeSchema();
  const result = await pool().query<{ total: string }>(
    `SELECT count(*)::text AS total
       FROM lynex_intake_requests
      WHERE source_hash = $1 AND created_at > now() - interval '10 minutes'`,
    [sourceHash],
  );
  return Number(result.rows[0]?.total || 0) >= 5;
}

export async function saveIntake(input: {
  id: string;
  answers: IntakeAnswers;
  classification: IntakeClassification;
  files: IntakeFile[];
  sourceHash: string;
}) {
  await ensureIntakeSchema();
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO lynex_intake_requests
        (id, contact_name, contact_email, source_hash, answers, classification)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb)`,
      [
        input.id,
        String(input.answers.contactName),
        String(input.answers.contactEmail),
        input.sourceHash,
        JSON.stringify(input.answers),
        JSON.stringify(input.classification),
      ],
    );
    for (const file of input.files) {
      await client.query(
        `INSERT INTO lynex_intake_files
          (request_id, file_name, mime_type, byte_size, content)
         VALUES ($1, $2, $3, $4, $5)`,
        [input.id, file.name, file.mimeType, file.size, file.content],
      );
    }
    await client.query(
      "INSERT INTO lynex_intake_outbox (request_id) VALUES ($1)",
      [input.id],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function claimDueIntakes(limit: number, requestId?: string) {
  await ensureIntakeSchema();
  const result = await pool().query<{ request_id: string }>(
    `WITH due AS (
       SELECT request_id
         FROM lynex_intake_outbox
        WHERE ($2::varchar IS NULL OR request_id = $2)
          AND (
            (status IN ('pending', 'retry') AND next_attempt_at <= now())
            OR (status = 'processing' AND locked_at < now() - interval '15 minutes')
          )
        ORDER BY next_attempt_at ASC
        FOR UPDATE SKIP LOCKED
        LIMIT $1
     )
     UPDATE lynex_intake_outbox AS outbox
        SET status = 'processing', locked_at = now()
       FROM due
      WHERE outbox.request_id = due.request_id
      RETURNING outbox.request_id`,
    [Math.max(1, Math.min(limit, 25)), requestId || null],
  );
  return result.rows.map((row) => row.request_id);
}

export async function loadIntake(id: string): Promise<StoredIntake | null> {
  await ensureIntakeSchema();
  const [request, attached] = await Promise.all([
    pool().query<{
      id: string;
      created_at: Date;
      answers: IntakeAnswers;
      classification: IntakeClassification;
    }>(
      "SELECT id, created_at, answers, classification FROM lynex_intake_requests WHERE id = $1",
      [id],
    ),
    pool().query<{
      file_name: string;
      mime_type: string;
      byte_size: number;
      content: Buffer;
    }>(
      "SELECT file_name, mime_type, byte_size, content FROM lynex_intake_files WHERE request_id = $1 ORDER BY id",
      [id],
    ),
  ]);
  const row = request.rows[0];
  if (!row) return null;
  return {
    id: row.id,
    createdAt: row.created_at,
    answers: row.answers,
    classification: row.classification,
    files: attached.rows.map((file) => ({
      name: file.file_name,
      mimeType: file.mime_type,
      size: file.byte_size,
      content: file.content,
    })),
  };
}

export async function markIntakeSent(id: string, providerId: string) {
  await pool().query(
    `UPDATE lynex_intake_outbox
        SET status = 'sent', sent_at = now(), provider_id = $2,
            locked_at = NULL, last_error = NULL
      WHERE request_id = $1`,
    [id, providerId],
  );
}

export async function markIntakeFailed(id: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  await pool().query(
    `UPDATE lynex_intake_outbox
        SET status = 'retry', attempts = attempts + 1, locked_at = NULL,
            last_error = left($2, 2000),
            next_attempt_at = now() + make_interval(secs => LEAST(86400, 300 * power(2, LEAST(attempts, 8)))::integer)
      WHERE request_id = $1`,
    [id, message],
  );
}
