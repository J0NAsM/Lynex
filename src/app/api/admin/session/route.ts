import { NextRequest, NextResponse } from "next/server";
import {
  adminPasswordMatches,
  createAdminSession,
  isAdminConfigured,
  setAdminSessionCookie,
} from "@/lib/server/admin-auth";

export const runtime = "nodejs";

declare global {
  var lynexAdminAttempts: Map<string, number[]> | undefined;
}

function clientAddress(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

function isSecureRequest(request: NextRequest) {
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  return forwardedProtocol ? forwardedProtocol === "https" : request.nextUrl.protocol === "https:";
}

function redirectToPanel(error?: string) {
  return new NextResponse(null, {
    status: 303,
    headers: {
      "Cache-Control": "no-store",
      Location: `/admin/pedidos${error ? `?error=${error}` : ""}`,
    },
  });
}

function isLoginRateLimited(request: NextRequest) {
  const now = Date.now();
  const cutoff = now - 15 * 60 * 1000;
  const key = clientAddress(request);
  const attempts = global.lynexAdminAttempts ||= new Map<string, number[]>();
  const recent = (attempts.get(key) || []).filter((time) => time > cutoff);
  if (recent.length >= 5) return true;
  recent.push(now);
  attempts.set(key, recent);
  return false;
}

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return redirectToPanel("config");
  }
  if (Number(request.headers.get("content-length") || 0) > 4096 || isLoginRateLimited(request)) {
    return redirectToPanel("limited");
  }

  let password = "";
  try {
    const form = await request.formData();
    password = String(form.get("password") || "").slice(0, 500);
  } catch {
    return redirectToPanel("invalid");
  }

  if (!adminPasswordMatches(password)) {
    return redirectToPanel("invalid");
  }

  global.lynexAdminAttempts?.delete(clientAddress(request));
  const session = createAdminSession();
  const response = redirectToPanel();
  setAdminSessionCookie(response, session.token, session.maxAge, isSecureRequest(request));
  return response;
}
