export type IntakeValue = string | string[];
export type IntakeAnswers = Record<string, IntakeValue>;

export type Choice = {
  value: string;
  label: string;
  description?: string;
};

export const ideaStages: Choice[] = [
  { value: "clear", label: "Ya sé qué sistema quiero pedir", description: "Puedo describir la solución y sus funciones principales." },
  { value: "general", label: "Quiero pedir una solución, pero necesito orientación", description: "Tengo una idea general y quiero que Lynex me ayude a definirla." },
  { value: "problem", label: "Quiero resolver un problema de mi negocio", description: "Todavía no sé qué sistema necesito." },
  { value: "replace", label: "Quiero reemplazar un sistema que ya utilizo", description: "Busco conservar lo útil y mejorar lo que hoy me limita." },
  { value: "feasibility", label: "Primero quiero confirmar si mi pedido es posible", description: "Necesito una evaluación inicial antes de avanzar." },
];

export const systemTypes: Choice[] = [
  { value: "web", label: "Sistema web" },
  { value: "mobile", label: "Aplicación móvil" },
  { value: "internal", label: "Sistema interno para una empresa" },
  { value: "ecommerce", label: "Tienda / ecommerce" },
  { value: "marketplace", label: "Marketplace" },
  { value: "management", label: "Sistema de gestión" },
  { value: "crm", label: "CRM" },
  { value: "erp", label: "ERP" },
  { value: "reservations", label: "Sistema de reservas" },
  { value: "appointments", label: "Sistema de turnos" },
  { value: "pos", label: "Sistema de ventas / POS" },
  { value: "inventory", label: "Inventario" },
  { value: "billing", label: "Facturación" },
  { value: "education", label: "Plataforma educativa" },
  { value: "client_portal", label: "Portal para clientes" },
  { value: "automation", label: "Automatización de procesos" },
  { value: "analytics", label: "Dashboard / analítica" },
  { value: "systems_integration", label: "Integración entre sistemas" },
  { value: "other", label: "Otro" },
  { value: "unsure", label: "No estoy seguro / quiero asesoramiento" },
];

export const currentTools: Choice[] = [
  { value: "excel", label: "Excel" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "paper", label: "Papel" },
  { value: "other_system", label: "Otro sistema" },
  { value: "several", label: "Varias herramientas diferentes" },
  { value: "manual", label: "Manualmente" },
  { value: "new_process", label: "Todavía no existe este proceso" },
  { value: "other", label: "Otro" },
  { value: "unsure", label: "No estoy seguro" },
];

export const userGroups: Choice[] = [
  { value: "admins", label: "Administradores" },
  { value: "employees", label: "Empleados" },
  { value: "clients", label: "Clientes" },
  { value: "providers", label: "Proveedores" },
  { value: "salespeople", label: "Vendedores" },
  { value: "technicians", label: "Técnicos" },
  { value: "drivers", label: "Repartidores" },
  { value: "professionals", label: "Profesionales independientes" },
  { value: "public", label: "Público general" },
  { value: "other", label: "Otros" },
  { value: "unsure", label: "No sé todavía" },
];

export const userCounts: Choice[] = [
  { value: "1_5", label: "1–5" },
  { value: "6_20", label: "6–20" },
  { value: "21_100", label: "21–100" },
  { value: "101_500", label: "101–500" },
  { value: "500_plus", label: "Más de 500" },
  { value: "unsure", label: "No lo sé todavía" },
];

export const features: Choice[] = [
  { value: "login", label: "Inicio de sesión" },
  { value: "permissions", label: "Usuarios y permisos" },
  { value: "admin", label: "Panel administrativo" },
  { value: "clients", label: "Gestión de clientes" },
  { value: "employees", label: "Gestión de empleados" },
  { value: "catalog", label: "Productos o servicios" },
  { value: "inventory", label: "Inventario" },
  { value: "sales", label: "Ventas" },
  { value: "purchases", label: "Compras" },
  { value: "payments", label: "Pagos" },
  { value: "billing", label: "Facturación" },
  { value: "reports", label: "Reportes" },
  { value: "statistics", label: "Estadísticas" },
  { value: "notifications", label: "Notificaciones" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "sms", label: "SMS" },
  { value: "geolocation", label: "Geolocalización" },
  { value: "maps", label: "Mapas" },
  { value: "reservations", label: "Reservas" },
  { value: "calendar", label: "Calendario" },
  { value: "documents", label: "Archivos / documentos" },
  { value: "photos", label: "Fotos" },
  { value: "signature", label: "Firma digital" },
  { value: "qr", label: "Códigos QR" },
  { value: "barcode", label: "Códigos de barras" },
  { value: "ai", label: "Inteligencia artificial" },
  { value: "automations", label: "Automatizaciones" },
  { value: "integrations", label: "Integración con otros sistemas" },
  { value: "api", label: "API" },
  { value: "other", label: "Otra" },
  { value: "recommend", label: "Prefiero que Lynex me recomiende" },
];

export const platforms: Choice[] = [
  { value: "browser", label: "Navegador web" },
  { value: "android", label: "Android" },
  { value: "iphone", label: "iPhone" },
  { value: "tablet", label: "Tablet" },
  { value: "desktop", label: "Computadora" },
  { value: "several", label: "Varias plataformas" },
  { value: "unsure", label: "Todavía no lo sé" },
];

export const offlineOptions: Choice[] = [
  { value: "yes", label: "Sí" },
  { value: "no", label: "No" },
  { value: "unsure", label: "No estoy seguro" },
];

export const designStyles: Choice[] = [
  { value: "minimal", label: "Minimalista" },
  { value: "modern", label: "Moderno" },
  { value: "corporate", label: "Corporativo" },
  { value: "elegant", label: "Elegante" },
  { value: "simple", label: "Simple y funcional" },
  { value: "colorful", label: "Colorido" },
  { value: "tech", label: "Tecnológico" },
  { value: "unsure", label: "No tengo preferencia" },
];

export const visualIdentity: Choice[] = [
  { value: "full", label: "Sí, logo y colores" },
  { value: "logo", label: "Tengo logo" },
  { value: "some", label: "Tengo algunos elementos" },
  { value: "none", label: "No" },
  { value: "help", label: "Necesito ayuda con esto" },
];

export const integrations: Choice[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "google", label: "Google" },
  { value: "microsoft", label: "Microsoft" },
  { value: "mercado_pago", label: "Mercado Pago" },
  { value: "bancard", label: "Bancard" },
  { value: "stripe", label: "Stripe" },
  { value: "accounting", label: "Sistemas contables" },
  { value: "electronic_billing", label: "Facturación electrónica" },
  { value: "erp", label: "ERP" },
  { value: "crm", label: "CRM" },
  { value: "own_api", label: "API propia" },
  { value: "other", label: "Otro software" },
  { value: "none", label: "No" },
  { value: "unsure", label: "No estoy seguro" },
];

export const existingData: Choice[] = [
  { value: "excel", label: "Excel" },
  { value: "database", label: "Base de datos" },
  { value: "other_system", label: "Otro sistema" },
  { value: "documents", label: "Documentos" },
  { value: "files", label: "Archivos" },
  { value: "none", label: "Todavía no tengo datos" },
  { value: "unsure", label: "No sé" },
];

export const priorities: Choice[] = [
  { value: "ease", label: "Facilidad de uso" },
  { value: "speed", label: "Velocidad" },
  { value: "design", label: "Diseño" },
  { value: "automation", label: "Automatización" },
  { value: "security", label: "Seguridad" },
  { value: "scalability", label: "Escalabilidad" },
  { value: "integrations", label: "Integraciones" },
  { value: "low_cost", label: "Bajo costo inicial" },
  { value: "fast_launch", label: "Poder lanzar rápidamente" },
];

export const currentAssets: Choice[] = [
  { value: "idea", label: "Solo la idea" },
  { value: "documentation", label: "Documentación" },
  { value: "designs", label: "Diseños" },
  { value: "prototype", label: "Prototipo" },
  { value: "code", label: "Código existente" },
  { value: "working_system", label: "Sistema funcionando" },
  { value: "database", label: "Base de datos existente" },
  { value: "other", label: "Otro" },
  { value: "unsure", label: "No estoy seguro" },
];

export const startDates: Choice[] = [
  { value: "asap", label: "Lo antes posible" },
  { value: "this_month", label: "Este mes" },
  { value: "1_3_months", label: "En 1–3 meses" },
  { value: "3_6_months", label: "En 3–6 meses" },
  { value: "later", label: "Más adelante" },
  { value: "researching", label: "Solo estoy investigando" },
];

export const budgets: Choice[] = [
  { value: "undefined", label: "Todavía no" },
  { value: "estimate", label: "Quiero recibir una estimación" },
  { value: "talk", label: "Prefiero conversarlo" },
  { value: "unsure", label: "No estoy seguro / quiero asesoramiento" },
];

export const processAreas: Choice[] = [
  { value: "sales", label: "Ventas" },
  { value: "administration", label: "Administración" },
  { value: "clients", label: "Clientes" },
  { value: "inventory", label: "Inventario" },
  { value: "staff", label: "Personal" },
  { value: "support", label: "Atención al cliente" },
  { value: "reservations", label: "Reservas" },
  { value: "collections", label: "Cobros" },
  { value: "deliveries", label: "Entregas" },
  { value: "production", label: "Producción" },
  { value: "documents", label: "Documentos" },
  { value: "reports", label: "Reportes" },
  { value: "communication", label: "Comunicación" },
  { value: "other", label: "Otro proceso" },
  { value: "unsure", label: "No estoy seguro" },
];

export const painPoints: Choice[] = [
  { value: "time", label: "Consume demasiado tiempo" },
  { value: "errors", label: "Hay muchos errores" },
  { value: "duplicates", label: "Hay información duplicada" },
  { value: "control", label: "No puedo controlar lo que ocurre" },
  { value: "employees", label: "Es difícil para los empleados" },
  { value: "reports", label: "No puedo obtener reportes" },
  { value: "manual", label: "No está automatizado" },
  { value: "clients", label: "Es difícil para los clientes" },
  { value: "other", label: "Otro" },
  { value: "unsure", label: "No estoy seguro" },
];

export const migrationOptions: Choice[] = [
  { value: "yes", label: "Sí" },
  { value: "no", label: "No" },
  { value: "unsure", label: "No sé todavía" },
];

export const contactPreferences: Choice[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "call", label: "Llamada" },
  { value: "video", label: "Videollamada" },
];

export const allChoiceGroups = {
  ideaStage: ideaStages,
  systemTypes,
  currentTools,
  userGroups,
  userCount: userCounts,
  features,
  platforms,
  offline: offlineOptions,
  designStyle: designStyles,
  visualIdentity,
  integrations,
  existingData,
  priorities,
  currentAssets,
  idealStart: startDates,
  budget: budgets,
  processAreas,
  painPoints,
  migration: migrationOptions,
  contactPreference: contactPreferences,
} as const;

export function choiceLabel(field: keyof typeof allChoiceGroups, value: string) {
  return allChoiceGroups[field].find((choice) => choice.value === value)?.label || value;
}

export function answerList(answers: IntakeAnswers, field: string) {
  const value = answers[field];
  return Array.isArray(value) ? value : value ? [value] : [];
}

export function answerText(answers: IntakeAnswers, field: string) {
  const value = answers[field];
  return typeof value === "string" ? value.trim() : "";
}
