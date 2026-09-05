import { createHmac, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  classifyIntake,
  publicSummary,
  sanitizeAnswers,
  validateAnswers,
} from "@/lib/intake-analysis";
import { isRateLimited, saveIntake } from "@/lib/server/intake-store";
import type { IntakeFile } from "@/lib/server/intake-store";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BODY_BYTES = 18 * 1024 * 1024;
const MAX_FILES = 5;
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_TOTAL_FILE_BYTES = 15 * 1024 * 1024;
const MIN_FILL_MS = 2_500;
const allowedExtensions = new Set(["pdf", "doc", "docx", "xls", "xlsx", "png", "jpg", "jpeg", "webp", "txt"]);

function firstValue(value: string | null) {
  return value?.split(",")[0]?.trim() || "";
}

function requestOrigin(request: NextRequest) {
  return request.headers.get("origin")?.replace(/\/$/, "") || "";
}

function allowedOrigins(request: NextRequest) {
  const configured = [process.env.NEXT_PUBLIC_SITE_URL, ...(process.env.INTAKE_ALLOWED_ORIGINS || "").split(",")]
    .filter(Boolean)
    .flatMap((value) => {
      try { return [new URL(String(value).trim()).origin]; } catch { return []; }
    });
  const host = firstValue(request.headers.get("x-forwarded-host")) || firstValue(request.headers.get("host"));
  const ownOrigin = host ? `${firstValue(request.headers.get("x-forwarded-proto")) || "https"}://${host}` : "";
  return new Set([...configured, ownOrigin].filter(Boolean));
}

function corsOrigin(request: NextRequest) {
  const origin = requestOrigin(request);
  if (!origin) return "";
  return allowedOrigins(request).has(origin) ? origin : null;
}

function json(request: NextRequest, body: object, status = 200) {
  const origin = corsOrigin(request);
  const response = NextResponse.json(body, { status });
  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
  }
  response.headers.set("Cache-Control", "no-store");
  return response;
}

function sourceHash(request: NextRequest) {
  const source = firstValue(request.headers.get("x-forwarded-for")) || firstValue(request.headers.get("x-real-ip")) || "anonymous";
  const secret = process.env.RATE_LIMIT_SECRET || process.env.ADMIN_SESSION_SECRET || "lynex-development";
  return createHmac("sha256", secret).update(source).digest("hex");
}

function newRequestId() {
  const day = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `LYX-${day}-${randomBytes(6).toString("hex").toUpperCase()}`;
}

function safeFilename(value: string) {
  return value.replace(/[\x00-\x1f<>:"/\\|?*]/g, "_").replace(/\s+/g, " ").trim().slice(0, 180) || "archivo";
}

async function parseFiles(form: FormData): Promise<IntakeFile[]> {
  const input = form.getAll("files").filter((item): item is File => item instanceof File && item.size > 0);
  if (input.length > MAX_FILES) throw new Error("Podés adjuntar como máximo 5 archivos.");
  let total = 0;
  const files: IntakeFile[] = [];
  for (const file of input) {
    const name = safeFilename(file.name);
    const extension = name.split(".").pop()?.toLowerCase() || "";
    if (!allowedExtensions.has(extension)) throw new Error(`El archivo ${name} no tiene un formato permitido.`);
    if (file.size > MAX_FILE_BYTES) throw new Error(`El archivo ${name} supera el límite de 8 MB.`);
    total += file.size;
    if (total > MAX_TOTAL_FILE_BYTES) throw new Error("Los archivos superan el límite total de 15 MB.");
    files.push({ name, mimeType: file.type || "application/octet-stream", size: file.size, content: Buffer.from(await file.arrayBuffer()) });
  }
  return files;
}

export function OPTIONS(request: NextRequest) {
  const origin = corsOrigin(request);
  if (origin === null) return new NextResponse(null, { status: 403 });
  const response = new NextResponse(null, { status: 204 });
  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
  }
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
}

export async function POST(request: NextRequest) {
  if (corsOrigin(request) === null) return json(request, { message: "Solicitud no permitida." }, 403);
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) return json(request, { message: "Los archivos enviados son demasiado grandes." }, 413);

  let form: FormData;
  try { form = await request.formData(); }
  catch { return json(request, { message: "No pudimos leer los datos enviados." }, 400); }

  const website = String(form.get("website") || "").trim();
  const elapsed = Number(form.get("elapsed"));
  if (website || (Number.isFinite(elapsed) && elapsed < MIN_FILL_MS)) return json(request, { ok: true });

  const rawPayload = form.get("payload");
  if (typeof rawPayload !== "string" || rawPayload.length > 80_000) return json(request, { message: "Los datos enviados no son válidos." }, 400);
  let parsed: unknown;
  try { parsed = JSON.parse(rawPayload); }
  catch { return json(request, { message: "Los datos enviados no son válidos." }, 400); }
  const answers = sanitizeAnswers(parsed);
  if (!answers) return json(request, { message: "Los datos enviados no son válidos." }, 400);
  const validation = validateAnswers(answers);
  if (validation) return json(request, { message: validation }, 400);

  let files: IntakeFile[];
  try { files = await parseFiles(form); }
  catch (error) { return json(request, { message: error instanceof Error ? error.message : "Revisá los archivos adjuntos." }, 400); }

  const hash = sourceHash(request);
  try {
    if (await isRateLimited(hash)) return json(request, { message: "Recibimos varias solicitudes. Esperá unos minutos antes de volver a enviar." }, 429);
    const id = newRequestId();
    const classification = classifyIntake(answers);
    await saveIntake({ id, answers, classification, files, sourceHash: hash });
    return json(request, { ok: true, id, summary: publicSummary(answers, classification) }, 201);
  } catch (error) {
    console.error("Could not persist intake request", error instanceof Error ? error.message : "unknown error");
    return json(request, { message: "No pudimos registrar la solicitud en este momento. Intentá nuevamente." }, 503);
  }
}
