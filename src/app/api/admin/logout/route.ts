import { NextRequest, NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/server/admin-auth";

export function POST(request: NextRequest) {
  const response = new NextResponse(null, {
    status: 303,
    headers: { "Cache-Control": "no-store", Location: "/admin/pedidos" },
  });
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const secure = forwardedProtocol ? forwardedProtocol === "https" : request.nextUrl.protocol === "https:";
  clearAdminSessionCookie(response, secure);
  return response;
}
