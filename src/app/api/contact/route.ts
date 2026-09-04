import { NextRequest, NextResponse } from "next/server";
import { site } from "@/lib/site";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
  elapsed?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_TRACKED_KEYS = 500;
const EMAIL_TIMEOUT_MS = 10_000;
// Nadie completa nombre, email y 20 caracteres de mensaje en menos de esto.
const MIN_FILL_MS = 2000;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

// El asunto del correo no debe poder contener saltos de linea.
function singleLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function firstValue(header: string | null) {
  return header?.split(",")[0]?.trim() || "";
}

function isRateLimited(key: string) {
  const now = Date.now();

  // Sin esto el Map crece indefinidamente: una entrada por IP vista.
  if (attempts.size > MAX_TRACKED_KEYS) {
    for (const [tracked, value] of attempts) {
      if (value.resetAt <= now) attempts.delete(tracked);
    }
  }

  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_ATTEMPTS;
}

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!origin || !host) return true;

  try {
    return new URL(origin).host === firstValue(host);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ message: "Solicitud no permitida." }, { status: 403 });
  }

  const key =
    firstValue(request.headers.get("x-forwarded-for")) ||
    firstValue(request.headers.get("x-real-ip")) ||
    "anonymous";
  if (isRateLimited(key)) {
    return NextResponse.json(
      { message: "Demasiados intentos. Esperá unos minutos y volvé a intentarlo." },
      { status: 429 },
    );
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ message: "Los datos enviados no son válidos." }, { status: 400 });
  }

  const name = singleLine(clean(payload.name));
  const email = clean(payload.email).toLowerCase();
  const message = clean(payload.message);
  const website = clean(payload.website);
  const elapsed = typeof payload.elapsed === "number" ? payload.elapsed : Number.NaN;

  // Los bots suelen completar este campo oculto o enviar al instante.
  // En ambos casos respondemos como si todo hubiera ido bien.
  if (website) return NextResponse.json({ ok: true });
  if (Number.isFinite(elapsed) && elapsed < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  if (
    name.length < 2 ||
    name.length > 80 ||
    email.length > 254 ||
    !emailPattern.test(email) ||
    message.length < 20 ||
    message.length > 3000
  ) {
    return NextResponse.json(
      { message: "Revisá tu nombre, email y mensaje antes de enviarlos." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error("Contact form is missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL");
    return NextResponse.json(
      { message: "El formulario no está disponible temporalmente." },
      { status: 503 },
    );
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");
  let response: Response;

  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "Lynex Contact Form/1.0",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Nueva consulta de ${name}`,
        text: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
        html: `<h2>Nueva consulta desde ${site.url.replace(/^https?:\/\//, "")}</h2><p><strong>Nombre:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Mensaje:</strong><br />${safeMessage}</p>`,
      }),
      signal: AbortSignal.timeout(EMAIL_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("Resend request failed", error);
    return NextResponse.json(
      { message: "No pudimos enviar el mensaje. Intentá nuevamente." },
      { status: 502 },
    );
  }

  if (!response.ok) {
    console.error("Resend rejected contact email", response.status, await response.text());
    return NextResponse.json(
      { message: "No pudimos enviar el mensaje. Intentá nuevamente." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
