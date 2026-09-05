import "server-only";

import { randomBytes } from "node:crypto";
import {
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import type { IntakeClassification } from "@/lib/intake-analysis";
import type { IntakeAnswers } from "@/lib/intake-options";

export type IntakeFile = {
  name: string;
  mimeType: string;
  size: number;
  content: Buffer;
};

export type StoredFile = {
  name: string;
  mimeType: string;
  size: number;
  storedName: string;
};

export type StoredIntake = {
  version: 1;
  id: string;
  createdAt: string;
  sourceHash: string;
  answers: IntakeAnswers;
  classification: IntakeClassification;
  files: StoredFile[];
};

const REQUEST_ID = /^LYX-\d{8}-[A-F0-9]{12}$/;

function dataRoot() {
  return path.resolve(/* turbopackIgnore: true */ process.env.INTAKE_DATA_DIR?.trim() || path.join(process.cwd(), "data"));
}

function requestsRoot() {
  return path.join(dataRoot(), "pedidos");
}

function requestDirectory(id: string) {
  if (!REQUEST_ID.test(id)) throw new Error("Invalid intake identifier");
  return path.join(requestsRoot(), id);
}

function metadataPath(id: string) {
  return path.join(requestDirectory(id), "pedido.json");
}

function safeStoredName(index: number, name: string) {
  const clean = path.basename(name).replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 160) || "archivo";
  return `${String(index + 1).padStart(2, "0")}-${clean}`;
}

function isStoredIntake(value: unknown): value is StoredIntake {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Partial<StoredIntake>;
  return record.version === 1
    && typeof record.id === "string"
    && REQUEST_ID.test(record.id)
    && typeof record.createdAt === "string"
    && typeof record.sourceHash === "string"
    && Boolean(record.answers && typeof record.answers === "object")
    && Boolean(record.classification && typeof record.classification === "object")
    && Array.isArray(record.files);
}

async function readStoredIntake(id: string) {
  try {
    const parsed = JSON.parse(await readFile(metadataPath(id), "utf8")) as unknown;
    return isStoredIntake(parsed) ? parsed : null;
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code === "ENOENT") return null;
    throw error;
  }
}

export async function isRateLimited(sourceHash: string) {
  const cutoff = Date.now() - 10 * 60 * 1000;
  const requests = await listIntakes();
  return requests.filter((request) => request.sourceHash === sourceHash && Date.parse(request.createdAt) > cutoff).length >= 5;
}

export async function saveIntake(input: {
  id: string;
  answers: IntakeAnswers;
  classification: IntakeClassification;
  files: IntakeFile[];
  sourceHash: string;
}) {
  if (!REQUEST_ID.test(input.id)) throw new Error("Invalid intake identifier");

  const root = requestsRoot();
  await mkdir(root, { recursive: true, mode: 0o700 });

  const temporaryDirectory = path.join(
    root,
    `.tmp-${input.id}-${randomBytes(5).toString("hex")}`,
  );
  const attachmentsDirectory = path.join(temporaryDirectory, "archivos");
  await mkdir(attachmentsDirectory, { recursive: true, mode: 0o700 });

  try {
    const files: StoredFile[] = [];
    for (const [index, file] of input.files.entries()) {
      const storedName = safeStoredName(index, file.name);
      await writeFile(path.join(attachmentsDirectory, storedName), file.content, { mode: 0o600 });
      files.push({ name: file.name, mimeType: file.mimeType, size: file.size, storedName });
    }

    const record: StoredIntake = {
      version: 1,
      id: input.id,
      createdAt: new Date().toISOString(),
      sourceHash: input.sourceHash,
      answers: input.answers,
      classification: input.classification,
      files,
    };

    await writeFile(
      path.join(temporaryDirectory, "pedido.json"),
      `${JSON.stringify(record, null, 2)}\n`,
      { encoding: "utf8", mode: 0o600 },
    );
    await rename(temporaryDirectory, requestDirectory(input.id));
  } catch (error) {
    await rm(temporaryDirectory, { recursive: true, force: true });
    throw error;
  }
}

export async function listIntakes() {
  let entries;
  try {
    entries = await readdir(requestsRoot(), { withFileTypes: true });
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code === "ENOENT") return [];
    throw error;
  }

  const records = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && REQUEST_ID.test(entry.name))
      .map((entry) => readStoredIntake(entry.name)),
  );

  return records
    .filter((record): record is StoredIntake => Boolean(record))
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
}

export async function loadIntake(id: string) {
  if (!REQUEST_ID.test(id)) return null;
  return readStoredIntake(id);
}

export async function loadIntakeFile(id: string, fileIndex: number) {
  const request = await loadIntake(id);
  if (!request || !Number.isInteger(fileIndex) || fileIndex < 0) return null;
  const file = request.files[fileIndex];
  if (!file || path.basename(file.storedName) !== file.storedName) return null;

  try {
    const content = await readFile(path.join(requestDirectory(id), "archivos", file.storedName));
    return { ...file, content };
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code === "ENOENT") return null;
    throw error;
  }
}
