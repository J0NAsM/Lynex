import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { processIntakeOutbox } from "@/lib/server/intake-worker";

export const runtime = "nodejs";
export const maxDuration = 60;

function authorized(request: NextRequest) {
  const expected = process.env.CRON_SECRET || "";
  const received = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!expected || expected.length !== received.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

async function run(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  try {
    const result = await processIntakeOutbox(10);
    return NextResponse.json({ ok: true, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Intake retry job failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ message: "No se pudo ejecutar el reintento." }, { status: 503 });
  }
}

export const GET = run;
export const POST = run;
