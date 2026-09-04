import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const dynamic = "force-static";
export const alt = "Lynex, sistemas por suscripción mensual en Paraguay";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#030d1d",
          color: "#f4f7fb",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          padding: "76px 86px",
          position: "relative",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 780 }}>
          <div style={{ color: "#dce3ec", display: "flex", fontSize: 30, fontWeight: 400, letterSpacing: "13px" }}>
            LYNEX
          </div>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, letterSpacing: "-4px", lineHeight: 1.04, marginTop: 72 }}>
            Sistemas Lynex por suscripción<span style={{ color: "#4c8dff" }}>.</span>
          </div>
          <div style={{ color: "#aac0ba", display: "flex", fontSize: 25, marginTop: 30 }}>{site.city}, {site.region} · Planes según cada empresa.</div>
        </div>
        <div style={{ background: "#72e6ff", borderRadius: 999, height: 280, opacity: 0.9, position: "absolute", right: -100, top: -95, width: 280 }} />
        <div style={{ border: "2px solid #4c8dff", borderRadius: 999, bottom: -190, height: 430, position: "absolute", right: 55, width: 430 }} />
      </div>
    ),
    size,
  );
}
