import { allChoiceGroups, answerList, answerText, choiceLabel } from "@/lib/intake-options";
import type { IntakeAnswers } from "@/lib/intake-options";
import type { StoredIntake } from "@/lib/server/intake-db";

type EmailRow = [label: string, value: string];

const choiceFields: Record<string, keyof typeof allChoiceGroups> = {
  ideaStage: "ideaStage",
  systemTypes: "systemTypes",
  currentTools: "currentTools",
  userGroups: "userGroups",
  userCount: "userCount",
  features: "features",
  platforms: "platforms",
  offline: "offline",
  designStyle: "designStyle",
  visualIdentity: "visualIdentity",
  integrations: "integrations",
  existingData: "existingData",
  priorities: "priorities",
  currentAssets: "currentAssets",
  idealStart: "idealStart",
  budget: "budget",
  processAreas: "processAreas",
  painPoints: "painPoints",
  migration: "migration",
  contactPreference: "contactPreference",
};

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function singleLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function humanAnswer(answers: IntakeAnswers, field: string) {
  const choiceField = choiceFields[field];
  if (choiceField) return answerList(answers, field).map((value) => choiceLabel(choiceField, value)).join(", ");
  return answerText(answers, field);
}

function cleanRows(rows: EmailRow[]) {
  return rows.filter(([, value]) => value.trim());
}

function renderRows(rows: EmailRow[]) {
  return cleanRows(rows).map(([label, value]) => `
    <div class="row">
      <div class="label">${escapeHtml(label)}</div>
      <div class="value">${escapeHtml(value).replaceAll("\n", "<br>")}</div>
    </div>`).join("");
}

function renderSection(title: string, rows: EmailRow[]) {
  const content = cleanRows(rows);
  if (!content.length) return "";
  return `<section><h2>${escapeHtml(title)}</h2><div class="section-card">${renderRows(content)}</div></section>`;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("es-PY", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Asuncion",
  }).format(value);
}

export function intakeSubject(intake: StoredIntake) {
  const projectType = singleLine(intake.classification.projectType || "Proyecto por definir").slice(0, 55);
  const name = singleLine(answerText(intake.answers, "contactName")).slice(0, 60);
  return `Nueva solicitud | ${projectType} | ${name} | ${intake.id}`;
}

export function buildIntakeEmail(intake: StoredIntake) {
  const { answers, classification } = intake;
  const name = humanAnswer(answers, "contactName");
  const problem = humanAnswer(answers, "problem") || humanAnswer(answers, "processDescription") || humanAnswer(answers, "feasibilityIdea") || "Por definir";
  const contactMethod = humanAnswer(answers, "contactPreference") || "Por definir";
  const deadline = humanAnswer(answers, "deadline") || humanAnswer(answers, "idealStart") || "Por definir";
  const essentials = [1, 2, 3].map((number) => humanAnswer(answers, `essential${number}`)).filter(Boolean);
  const receivedAt = formatDate(intake.createdAt);
  const attachmentNames = intake.files.map((file) => `${file.name} (${Math.ceil(file.size / 1024)} KB)`).join("\n");

  const sections = [
    renderSection("Datos del cliente", [
      ["Nombre", name], ["Empresa", humanAnswer(answers, "company")],
      ["Email", humanAnswer(answers, "contactEmail")], ["Teléfono / WhatsApp", humanAnswer(answers, "contactPhone")],
      ["Ciudad / País", humanAnswer(answers, "contactLocation")], ["Preferencia de contacto", contactMethod],
    ]),
    renderSection("Necesidad y nivel de definición", [
      ["Tipo de proyecto", classification.projectType], ["Etapa de la idea", humanAnswer(answers, "ideaStage")],
      ["Descripción del sistema", humanAnswer(answers, "systemDescription") || humanAnswer(answers, "ideaDescription") || humanAnswer(answers, "feasibilityIdea")],
      ["Problema que quiere resolver", problem], ["Proceso que quiere mejorar", humanAnswer(answers, "processAreas")],
      ["Qué sucede actualmente y qué quiere mejorar", humanAnswer(answers, "processDescription")],
      ["Dificultades principales", humanAnswer(answers, "painPoints")],
    ]),
    renderSection("Personas y recorrido esperado", [
      ["Quiénes lo utilizarán", humanAnswer(answers, "userGroups")], ["Cantidad aproximada", humanAnswer(answers, "userCount")],
      ["Recorrido principal esperado", humanAnswer(answers, "userFlow")],
    ]),
    renderSection("Funciones y plataformas", [
      ["Funciones imaginadas", humanAnswer(answers, "features")], ["Plataformas", humanAnswer(answers, "platforms")],
      ["Funcionamiento sin internet", humanAnswer(answers, "offline")], ["Integraciones", humanAnswer(answers, "integrations")],
    ]),
    renderSection("Sistema o proceso actual", [
      ["Cómo realizan hoy el trabajo", humanAnswer(answers, "currentTools")], ["Sistema actual", humanAnswer(answers, "currentSystem")],
      ["Qué funciona bien", humanAnswer(answers, "systemStrengths")], ["Qué quiere mejorar", humanAnswer(answers, "systemImprovements")],
      ["Tareas lentas, repetitivas o difíciles", humanAnswer(answers, "slowTasks")], ["Necesita migrar información", humanAnswer(answers, "migration")],
    ]),
    renderSection("Información y materiales disponibles", [
      ["Información para incorporar", humanAnswer(answers, "existingData")], ["Estado actual", humanAnswer(answers, "currentAssets")],
      ["Archivos adjuntos", attachmentNames],
    ]),
    renderSection("Primera versión y prioridades", [
      ["Las 3 cosas imprescindibles", essentials.map((item, index) => `${index + 1}. ${item}`).join("\n")],
      ["Prioridades, en orden", humanAnswer(answers, "priorities")],
    ]),
    renderSection("Preferencias visuales", [
      ["Estilo deseado", humanAnswer(answers, "designStyle")], ["Referencias", humanAnswer(answers, "styleReferences")],
      ["Identidad visual disponible", humanAnswer(answers, "visualIdentity")],
    ]),
    renderSection("Plazo, inversión y resultado esperado", [
      ["Fecha ideal para empezar", humanAnswer(answers, "idealStart")], ["Fecha límite", humanAnswer(answers, "deadline")],
      ["Rango de inversión", humanAnswer(answers, "budget")], ["Cómo medirá el éxito", humanAnswer(answers, "successOutcome")],
    ]),
    renderSection("Preanálisis automático", [
      ["Complejidad estimada", classification.complexity], ["Módulos probables", classification.probableModules.join(", ")],
      ["Plataformas", classification.platforms.join(", ")], ["Integraciones", classification.integrations.join(", ")],
      ["Prioridad principal", classification.priority], ["Nivel de definición", classification.definitionLevel],
      ["Próximos pasos sugeridos", classification.nextSteps.map((item, index) => `${index + 1}. ${item}`).join("\n")],
    ]),
    renderSection("Referencia de la solicitud", [
      ["Identificador", intake.id], ["Fecha y hora de recepción", receivedAt],
    ]),
  ].join("");

  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{margin:0;background:#eef2f7;color:#0b1424;font-family:Arial,Helvetica,sans-serif} .wrap{width:100%;padding:24px 0}
  .mail{background:#fff;margin:0 auto;max-width:720px;overflow:hidden} .brand{background:#030d1d;color:#fff;padding:28px 34px}
  .brand strong{font-size:24px;letter-spacing:.28em}.brand span{color:#72e6ff}.hero{background:#0e2745;color:#fff;padding:30px 34px}
  .kicker{color:#72e6ff;font-size:10px;font-weight:bold;letter-spacing:.14em;text-transform:uppercase}.hero h1{font-size:27px;line-height:1.2;margin:9px 0 8px}
  .hero p{color:#c7d3e3;font-size:13px;line-height:1.6;margin:0}.quick{display:flex;flex-wrap:wrap;gap:1px;background:#29435f;margin-top:24px}
  .quick div{background:#163453;box-sizing:border-box;flex:1 1 31%;min-width:170px;padding:14px}.quick b{color:#90a8c1;display:block;font-size:9px;letter-spacing:.08em;margin-bottom:6px;text-transform:uppercase}.quick span{font-size:12px;line-height:1.45}
  .content{padding:12px 34px 34px}section{margin-top:30px}h2{color:#183653;font-size:14px;margin:0 0 10px}.section-card{border:1px solid #dce4ed}
  .row{border-bottom:1px solid #e7ecf2;display:flex;gap:24px;padding:12px 14px}.row:last-child{border-bottom:0}.label{color:#6d7d91;flex:0 0 185px;font-size:10px;font-weight:bold;line-height:1.5}.value{font-size:12px;line-height:1.6;overflow-wrap:anywhere}
  .footer{background:#f3f6f9;color:#6f7d8f;font-size:10px;line-height:1.6;padding:20px 34px}
  @media(max-width:560px){.wrap{padding:0}.brand,.hero,.content,.footer{padding-left:20px;padding-right:20px}.hero h1{font-size:23px}.quick{display:block}.quick div{border-bottom:1px solid #29435f}.row{display:block}.label{margin-bottom:5px}.value{font-size:13px}}
</style></head><body><div class="wrap"><main class="mail">
  <header class="brand"><strong>LYN<span>E</span>X</strong></header>
  <div class="hero"><div class="kicker">Nueva solicitud · ${escapeHtml(intake.id)}</div><h1>${escapeHtml(name)} necesita ${escapeHtml(classification.projectType.toLowerCase())}</h1><p>${escapeHtml(problem)}</p>
    <div class="quick"><div><b>Tipo</b><span>${escapeHtml(classification.projectType)}</span></div><div><b>Prioridad</b><span>${escapeHtml(classification.priority)}</span></div><div><b>Plazo</b><span>${escapeHtml(deadline)}</span></div><div><b>Contacto</b><span>${escapeHtml(contactMethod)}</span></div></div>
  </div><div class="content">${sections}</div>
  <footer class="footer">Pedido recibido mediante el configurador de servicios de Lynex. La información se presenta en lenguaje natural para facilitar su revisión por cualquier integrante del equipo.</footer>
</main></div></body></html>`;

  const textSections = [
    `NUEVA SOLICITUD · ${intake.id}`,
    `${name} necesita ${classification.projectType}`,
    `Problema principal: ${problem}`,
    `Prioridad: ${classification.priority}`,
    `Plazo: ${deadline}`,
    `Contacto preferido: ${contactMethod}`,
    ...sectionsToText(answers, intake),
  ];
  return { subject: intakeSubject(intake), html, text: textSections.join("\n\n") };
}

function sectionsToText(answers: IntakeAnswers, intake: StoredIntake) {
  const fields: EmailRow[] = [
    ["Nombre", humanAnswer(answers, "contactName")], ["Empresa", humanAnswer(answers, "company")],
    ["Email", humanAnswer(answers, "contactEmail")], ["Teléfono / WhatsApp", humanAnswer(answers, "contactPhone")],
    ["Ciudad / País", humanAnswer(answers, "contactLocation")], ["Etapa de la idea", humanAnswer(answers, "ideaStage")],
    ["Descripción", humanAnswer(answers, "systemDescription") || humanAnswer(answers, "ideaDescription") || humanAnswer(answers, "feasibilityIdea")],
    ["Problema", humanAnswer(answers, "problem") || humanAnswer(answers, "processDescription")],
    ["Usuarios", humanAnswer(answers, "userGroups")], ["Cantidad", humanAnswer(answers, "userCount")],
    ["Recorrido esperado", humanAnswer(answers, "userFlow")], ["Funciones", humanAnswer(answers, "features")],
    ["Plataformas", humanAnswer(answers, "platforms")], ["Integraciones", humanAnswer(answers, "integrations")],
    ["Proceso actual", humanAnswer(answers, "currentTools")], ["Prioridades", humanAnswer(answers, "priorities")],
    ["Fecha ideal", humanAnswer(answers, "idealStart")], ["Fecha límite", humanAnswer(answers, "deadline")],
    ["Inversión", humanAnswer(answers, "budget")], ["Resultado esperado", humanAnswer(answers, "successOutcome")],
    ["Complejidad estimada", intake.classification.complexity], ["Próximos pasos", intake.classification.nextSteps.join("\n")],
    ["Archivos", intake.files.map((file) => file.name).join(", ")], ["Recibida", formatDate(intake.createdAt)],
  ];
  return cleanRows(fields).map(([label, value]) => `${label}: ${value}`);
}
