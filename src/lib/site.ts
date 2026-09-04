const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const configuredEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

export const site = {
  name: "Lynex",
  description:
    "Diseñamos y desarrollamos software a medida para ordenar operaciones, automatizar procesos y tomar mejores decisiones.",
  email: configuredEmail || "hola@lynex.dev",
  url: (configuredUrl || "https://lynex.dev").replace(/\/$/, ""),
};
