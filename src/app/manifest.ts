import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lynex — Software a medida",
    short_name: "Lynex",
    description: "Software a medida para negocios que avanzan.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f7f3",
    theme_color: "#132b28",
    lang: "es",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

