import { ImageResponse } from "next/og";

export const alt = "Lynex, webs y sistemas a medida en Paraguay";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#132b28",
          color: "#f5f7f3",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          padding: "76px 86px",
          position: "relative",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 780 }}>
          <div style={{ alignItems: "center", display: "flex", fontSize: 34, fontWeight: 700, gap: 16 }}>
            <span style={{ alignItems: "center", background: "#ff735c", display: "flex", height: 52, justifyContent: "center", transform: "rotate(-8deg)", width: 52 }}>L</span>
            Lynex
          </div>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, letterSpacing: "-4px", lineHeight: 1.04, marginTop: 72 }}>
            Webs y sistemas hechos para tu negocio<span style={{ color: "#ff735c" }}>.</span>
          </div>
          <div style={{ color: "#aac0ba", fontSize: 25, marginTop: 30 }}>Asunción, Paraguay · Precio y plazo por escrito.</div>
        </div>
        <div style={{ background: "#d4f36a", borderRadius: 999, height: 280, opacity: 0.95, position: "absolute", right: -100, top: -95, width: 280 }} />
        <div style={{ border: "2px solid #ff735c", borderRadius: 999, bottom: -190, height: 430, position: "absolute", right: 55, width: 430 }} />
      </div>
    ),
    size,
  );
}
