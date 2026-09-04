import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lynex — Webs y sistemas a medida",
    short_name: site.name,
    description: site.description,
    start_url: `${site.basePath}/`,
    display: "standalone",
    background_color: "#f5f7f3",
    theme_color: "#132b28",
    lang: "es-PY",
    icons: [{ src: `${site.basePath}/icon.svg`, sizes: "any", type: "image/svg+xml" }],
  };
}
