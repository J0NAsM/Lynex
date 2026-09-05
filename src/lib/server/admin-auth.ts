import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE = "lynex_admin_session";
const SESSION_SECONDS = 12 * 60 * 60;

function adminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() || "";
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || adminPassword();
}

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function signature(expiresAt: string) {
  return createHmac("sha256", sessionSecret()).update(`admin.${expiresAt}`).digest("base64url");
}

export function isAdminConfigured() {
  return adminPassword().length >= 12 && sessionSecret().length >= 12;
}

export function adminPasswordMatches(candidate: string) {
  const expected = adminPassword();
  return isAdminConfigured() && timingSafeEqual(digest(candidate), digest(expected));
}

export function createAdminSession() {
  if (!isAdminConfigured()) throw new Error("Admin access is not configured");
  const expiresAt = String(Date.now() + SESSION_SECONDS * 1000);
  return { token: `${expiresAt}.${signature(expiresAt)}`, maxAge: SESSION_SECONDS };
}

export function isValidAdminSession(token: string | undefined) {
  if (!token || !isAdminConfigured()) return false;
  const [expiresAt, providedSignature, extra] = token.split(".");
  if (!expiresAt || !providedSignature || extra || !/^\d{13}$/.test(expiresAt)) return false;
  if (Number(expiresAt) <= Date.now()) return false;
  return timingSafeEqual(digest(providedSignature), digest(signature(expiresAt)));
}

export async function hasAdminSession() {
  return isValidAdminSession((await cookies()).get(ADMIN_COOKIE)?.value);
}

export function hasAdminRequestSession(request: NextRequest) {
  return isValidAdminSession(request.cookies.get(ADMIN_COOKIE)?.value);
}

export function setAdminSessionCookie(response: NextResponse, token: string, maxAge: number, secure: boolean) {
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    maxAge,
    path: "/admin",
    sameSite: "strict",
    secure,
    priority: "high",
  });
}

export function clearAdminSessionCookie(response: NextResponse, secure: boolean) {
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/admin",
    sameSite: "strict",
    secure,
  });
}
