import { NextRequest, NextResponse } from "next/server";
import { hasAdminRequestSession } from "@/lib/server/admin-auth";
import { loadIntakeFile } from "@/lib/server/intake-store";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: RouteContext<"/admin/pedidos/[id]/archivos/[index]">,
) {
  if (!hasAdminRequestSession(request)) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  const { id, index } = await context.params;
  const file = await loadIntakeFile(id, Number(index));
  if (!file) return NextResponse.json({ message: "Archivo no encontrado." }, { status: 404 });

  const fallbackName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_") || "archivo";
  return new NextResponse(file.content, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="${fallbackName}"; filename*=UTF-8''${encodeURIComponent(file.name)}`,
      "Content-Length": String(file.content.byteLength),
      "Content-Type": file.mimeType || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
