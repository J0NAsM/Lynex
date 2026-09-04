const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const configuredEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
const configuredWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
const configuredPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim();
const configuredLinkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim();
const configuredWebPrice = process.env.NEXT_PUBLIC_WEB_PRICE_FROM?.trim();
const configuredSystemPrice = process.env.NEXT_PUBLIC_SYSTEM_PRICE_FROM?.trim();

function publicHttpUrl(value: string | undefined) {
  if (!value) return "";

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

/**
 * Datos del negocio. Fuente unica: si un dato aparece en la web, el correo,
 * LinkedIn o WhatsApp, sale de aqui.
 *
 * Los datos opcionales se configuran con variables de entorno. La interfaz los
 * oculta cuando no existen, en lugar de inventar información comercial.
 */
export const site = {
  name: "Lynex",
  description:
    "Construimos webs y sistemas a medida para empresas que ya no pueden crecer con planillas y herramientas sueltas.",
  email: configuredEmail || "hola@lynex.dev",
  url: (configuredUrl || "https://lynex.dev").replace(/\/$/, ""),

  city: "Asunción",
  region: "Paraguay",
  locale: "es_PY",

  whatsapp: configuredWhatsapp || "",
  phone: configuredPhone || "",
  linkedin: publicHttpUrl(configuredLinkedin),
} as const;

export const whatsappLink = site.whatsapp
  ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
      "Hola, quiero consultar por un proyecto.",
    )}`
  : "";

/**
 * Las dos ofertas del negocio. Si no hay un precio mínimo configurado, la
 * tarjeta conserva el plazo y omite el precio sin mostrar placeholders.
 */
export const offers = [
  {
    id: "web",
    eyebrow: "Punto de partida",
    title: "Tu presencia web, bien hecha",
    text: "Un sitio rápido, que se ve bien en el celular y que la gente encuentra en Google. Sin plantillas genéricas ni páginas que tardan en cargar.",
    includes: [
      "Diseño propio, no una plantilla",
      "Optimizado para celular y para Google",
      "Formulario o WhatsApp que te llega de verdad",
      "Lo publicamos y te lo dejamos funcionando",
    ],
    from: configuredWebPrice || "",
    time: "2 a 4 semanas",
    cta: "Quiero mi sitio web",
  },
  {
    id: "sistema",
    eyebrow: "Cuando la planilla ya no da",
    title: "El sistema que tu operación necesita",
    text: "Software construido alrededor de cómo ya trabajan: pedidos, stock, cobranzas, reportes. No al revés.",
    includes: [
      "Empezamos con un diagnóstico corto del proceso",
      "Entregas cada dos semanas, no una caja negra",
      "Alcance, precio y fecha por escrito antes de arrancar",
      "El código y los accesos son tuyos",
    ],
    from: configuredSystemPrice || "",
    time: "Primera versión útil en 4 a 8 semanas",
    cta: "Quiero un diagnóstico",
  },
] as const;
