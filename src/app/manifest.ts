import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lynex — Sistemas por suscripción mensual",
    short_name: site.name,
    description: site.description,
    start_url: `${site.basePath}/`,
    display: "standalone",
    background_color: "#f4f7fb",
    theme_color: "#030d1d",
    lang: "es-PY",
    icons: [{ src: `${site.basePath}/icon.svg`, sizes: "any", type: "image/svg+xml" }],
  };
}
