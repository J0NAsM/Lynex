const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const configuredEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
const configuredWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
const configuredPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim();
const configuredLinkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim();
const configuredWebPrice = process.env.NEXT_PUBLIC_WEB_PRICE_FROM?.trim();
const configuredSystemPrice = process.env.NEXT_PUBLIC_SYSTEM_PRICE_FROM?.trim();
const configuredIntakeApiUrl = process.env.NEXT_PUBLIC_INTAKE_API_URL?.trim();
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
    "Sistemas Lynex por suscripción mensual y servicios web administrados para empresas.",
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
  intakeApiUrl:
    publicHttpUrl(configuredIntakeApiUrl) || (staticHosting ? "" : "/api/intake"),

  whatsapp: configuredWhatsapp || "595986914726",
  phone: configuredPhone || "+595 986 914 726",
  linkedin: publicHttpUrl(configuredLinkedin),
} as const;

export const whatsappLink = site.whatsapp
  ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
      "Hola, quiero consultar por uno de los sistemas de Lynex.",
    )}`
  : "";

export const phoneLink = site.phone
  ? `tel:+${site.phone.replace(/\D/g, "")}`
  : "";

/**
 * Las dos ofertas por suscripción del negocio. El precio mensual puede
 * configurarse para cada plan; sin una cifra pública se comunica como variable.
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
    monthlyPrice: configuredWebPrice || "Según el servicio contratado",
    time: "Activación inicial en 2 a 4 semanas",
    cta: "Pedir este servicio",
  },
  {
    id: "sistema",
    eyebrow: "Productos Lynex",
    title: "Usá el sistema que tu empresa necesita",
    text: "Lynex desarrolla y administra sus propios sistemas. Contratás el acceso al producto y al plan que mejor encaje con tu operación, pagando una suscripción mensual.",
    includes: [
      "Acceso al sistema incluido en la suscripción",
      "Configuración inicial para tu empresa",
      "Actualizaciones, mantenimiento y soporte",
      "Planes según usuarios, funciones y nivel de servicio",
    ],
    monthlyPrice: configuredSystemPrice || "Según el sistema y el plan",
    time: "Activación según sistema y configuración",
    cta: "Pedir un sistema",
  },
] as const;
