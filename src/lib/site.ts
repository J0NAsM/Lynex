const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const configuredEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
const configuredWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
const configuredPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim();
const configuredLinkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim();
const configuredWebPrice = process.env.NEXT_PUBLIC_WEB_PRICE_FROM?.trim();
const configuredSystemPrice = process.env.NEXT_PUBLIC_SYSTEM_PRICE_FROM?.trim();
const staticHosting = process.env.NEXT_PUBLIC_STATIC_HOSTING === "true";

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
 * Los datos públicos se pueden reemplazar con variables de entorno. Los
 * precios y enlaces comerciales opcionales se ocultan cuando no existen.
 */
export const site = {
  name: "Lynex",
  description:
    "Soluciones web y sistemas SaaS para empresas que ya no pueden crecer con planillas y herramientas sueltas.",
  email: configuredEmail || "martinezlynex@gmail.com",
  url: (configuredUrl || "https://lynex.dev").replace(/\/$/, ""),

  city: "Carapeguá",
  region: "Paraguay",
  locale: "es_PY",
  basePath: (() => {
    try {
      return new URL((configuredUrl || "https://lynex.dev").replace(/\/$/, "")).pathname.replace(/\/$/, "");
    } catch {
      return "";
    }
  })(),
  staticHosting,

  whatsapp: configuredWhatsapp || "595986914726",
  phone: configuredPhone || "+595 986 914 726",
  linkedin: publicHttpUrl(configuredLinkedin),
} as const;

export const whatsappLink = site.whatsapp
  ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
      "Hola, quiero consultar por una solución SaaS.",
    )}`
  : "";

export const phoneLink = site.phone
  ? `tel:+${site.phone.replace(/\D/g, "")}`
  : "";

/**
 * Las dos ofertas SaaS del negocio. El precio mensual puede configurarse para
 * cada plan; mientras no exista una cifra pública se comunica como variable.
 */
export const offers = [
  {
    id: "web",
    eyebrow: "Punto de partida",
    title: "Tu presencia web como servicio",
    text: "Un sitio rápido, administrado por Lynex, que se ve bien en el celular y que la gente encuentra en Google. Se mantiene activo y actualizado dentro de un plan mensual.",
    includes: [
      "Diseño propio, no una plantilla",
      "Optimizado para celular y para Google",
      "Hosting, seguridad y actualizaciones",
      "Formulario, correo y WhatsApp integrados",
    ],
    monthlyPrice: configuredWebPrice || "Según alcance y servicio",
    time: "Activación inicial en 2 a 4 semanas",
    cta: "Quiero conocer mi plan",
  },
  {
    id: "sistema",
    eyebrow: "Cuando la planilla ya no da",
    title: "Software SaaS para tu operación",
    text: "Una solución administrada alrededor de cómo ya trabajan: pedidos, stock, cobranzas y reportes. Accedés al servicio mediante un plan adaptado a tu operación.",
    includes: [
      "Empezamos con un diagnóstico corto del proceso",
      "Configuración inicial y mejoras por etapas",
      "Operación, mantenimiento y soporte continuo",
      "Plan mensual según usuarios, funciones e integraciones",
    ],
    monthlyPrice: configuredSystemPrice || "Según alcance y uso",
    time: "Primera versión en 4 a 8 semanas",
    cta: "Quiero definir mi plan",
  },
] as const;
