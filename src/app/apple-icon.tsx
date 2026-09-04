import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS ignora el SVG del manifest y usa este PNG al guardar en pantalla de inicio.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#030d1d",
          color: "#eef3f8",
          display: "flex",
          fontSize: 108,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        L
      </div>
    ),
    size,
  );
}
