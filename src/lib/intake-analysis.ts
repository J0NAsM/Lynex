import {
  IntakeAnswers,
  allChoiceGroups,
  answerList,
  answerText,
  choiceLabel,
  features,
  ideaStages,
  integrations,
  platforms,
  processAreas,
  systemTypes,
  userCounts,
  userGroups,
} from "@/lib/intake-options";

export type IntakeClassification = {
  projectType: string;
  complexity: "Baja" | "Media" | "Alta";
  probableModules: string[];
  platforms: string[];
  integrations: string[];
  priority: string;
  definitionLevel: string;
  nextSteps: string[];
};

export type IntakeSummary = {
  projectType: string;
  problem: string;
  users: string;
  platforms: string;
  priority: string;
  stage: string;
};

const knownFields = new Set([
  ...Object.keys(allChoiceGroups),
  "systemDescription", "problem", "userFlow", "styleReferences", "currentSystem",
  "systemStrengths", "systemImprovements", "slowTasks", "essential1", "essential2",
  "essential3", "deadline", "successOutcome", "ideaDescription", "processDescription",
  "feasibilityIdea", "contactName", "company", "contactEmail", "contactPhone",
  "contactLocation",
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function sanitizeAnswers(value: unknown): IntakeAnswers | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const clean: IntakeAnswers = {};

  for (const [key, raw] of Object.entries(value)) {
    if (!knownFields.has(key)) continue;
    if (typeof raw === "string") {
      clean[key] = raw.trim().slice(0, 5000);
      continue;
    }
    if (Array.isArray(raw)) {
      clean[key] = raw
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().slice(0, 300))
        .filter(Boolean)
        .slice(0, 40);
    }
  }
  return clean;
}

function includesOnly(values: string[], choices: readonly { value: string }[]) {
  const allowed = new Set(choices.map((choice) => choice.value));
  return values.length > 0 && values.every((value) => allowed.has(value));
}

export function validateAnswers(answers: IntakeAnswers) {
  const stage = answerText(answers, "ideaStage");
  if (!ideaStages.some((item) => item.value === stage)) return "Elegí en qué etapa está tu idea.";
  if (answerText(answers, "contactName").length < 2) return "Revisá el nombre de contacto.";
  if (!emailPattern.test(answerText(answers, "contactEmail"))) return "Revisá el email de contacto.";
  if (answerText(answers, "contactPhone").replace(/\D/g, "").length < 6) return "Revisá el teléfono de contacto.";
  if (answerText(answers, "contactLocation").length < 2) return "Indicá la ciudad y el país.";
  if (!includesOnly(answerList(answers, "contactPreference"), allChoiceGroups.contactPreference)) return "Elegí cómo preferís que te contactemos.";
  if (!includesOnly(answerList(answers, "idealStart"), allChoiceGroups.idealStart)) return "Elegí una fecha aproximada para empezar.";
  if (!includesOnly(answerList(answers, "budget"), allChoiceGroups.budget)) return "Elegí una opción de inversión.";
  if (answerText(answers, "successOutcome").length < 15) return "Contanos cómo medirías el éxito.";
  if (!includesOnly(answerList(answers, "userGroups"), userGroups) || !includesOnly(answerList(answers, "userCount"), userCounts)) return "Revisá quiénes utilizarían el sistema.";

  if (stage === "problem") {
    if (!includesOnly(answerList(answers, "processAreas"), processAreas)) return "Elegí el proceso que querés mejorar.";
    if (answerText(answers, "processDescription").length < 20) return "Contanos un poco más sobre el proceso actual.";
    if (!includesOnly(answerList(answers, "currentTools"), allChoiceGroups.currentTools)) return "Indicá cómo realizan actualmente ese trabajo.";
    if (!includesOnly(answerList(answers, "painPoints"), allChoiceGroups.painPoints)) return "Elegí qué dificulta el proceso.";
  } else {
    if (!includesOnly(answerList(answers, "systemTypes"), systemTypes)) return "Elegí un tipo de solución o pedinos asesoramiento.";
    const mainDescription = stage === "feasibility" ? answerText(answers, "feasibilityIdea") : stage === "general" ? answerText(answers, "ideaDescription") : answerText(answers, "systemDescription");
    if (mainDescription.length < 20) return "Describí un poco más la idea o el sistema.";
    if (answerText(answers, "problem").length < 10) return "Contanos qué problema querés resolver.";
  }

  if (stage === "clear" || stage === "replace" || stage === "general") {
    if (!includesOnly(answerList(answers, "currentTools"), allChoiceGroups.currentTools)) return "Indicá cómo realizan actualmente ese trabajo.";
    if (answerText(answers, "userFlow").length < 15) return "Describí el recorrido principal de una persona.";
    if (!includesOnly(answerList(answers, "platforms"), platforms) || !includesOnly(answerList(answers, "offline"), allChoiceGroups.offline)) return "Revisá las plataformas y el uso sin conexión.";
    if (!includesOnly(answerList(answers, "integrations"), integrations)) return "Elegí las integraciones o indicá que no estás seguro.";
    if (["essential1", "essential2", "essential3"].some((field) => answerText(answers, field).length < 3)) return "Completá las tres cosas imprescindibles.";
  }

  if (stage === "clear" || stage === "replace") {
    if (!includesOnly(answerList(answers, "features"), features)) return "Elegí funciones o pedinos una recomendación.";
    if (!includesOnly(answerList(answers, "designStyle"), allChoiceGroups.designStyle) || !includesOnly(answerList(answers, "visualIdentity"), allChoiceGroups.visualIdentity)) return "Revisá las preferencias visuales.";
    if (!includesOnly(answerList(answers, "existingData"), allChoiceGroups.existingData) || !includesOnly(answerList(answers, "currentAssets"), allChoiceGroups.currentAssets)) return "Revisá la información y los materiales existentes.";
  }

  if (stage === "feasibility" && (!includesOnly(answerList(answers, "existingData"), allChoiceGroups.existingData) || !includesOnly(answerList(answers, "currentAssets"), allChoiceGroups.currentAssets))) return "Revisá el material disponible para evaluar la idea.";
  if (stage === "replace" && (answerText(answers, "currentSystem").length < 2 || answerText(answers, "systemImprovements").length < 10 || !includesOnly(answerList(answers, "migration"), allChoiceGroups.migration))) return "Completá los datos del sistema que querés reemplazar.";
  return "";
}

function labels<K extends keyof typeof allChoiceGroups>(answers: IntakeAnswers, field: K) {
  return answerList(answers, field).map((value) => choiceLabel(field, value));
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function preferredType(answers: IntakeAnswers) {
  const selected = answerList(answers, "systemTypes").filter((value) => !["unsure", "other"].includes(value));
  if (selected.length) return selected.map((value) => choiceLabel("systemTypes", value)).join(" + ");
  const areas = answerList(answers, "processAreas").filter((value) => value !== "unsure");
  if (areas.length) return `Optimización de ${areas.map((value) => choiceLabel("processAreas", value).toLowerCase()).join(" y ")}`;
  return "Proyecto por definir";
}

export function classifyIntake(answers: IntakeAnswers): IntakeClassification {
  const stage = answerText(answers, "ideaStage");
  const selectedFeatures = answerList(answers, "features").filter((item) => !["other", "recommend"].includes(item));
  const selectedIntegrations = answerList(answers, "integrations").filter((item) => !["none", "unsure", "other"].includes(item));
  const selectedPlatforms = answerList(answers, "platforms").filter((item) => !["unsure", "several"].includes(item));
  const countWeight: Record<string, number> = { "1_5": 0, "6_20": 1, "21_100": 2, "101_500": 4, "500_plus": 6, unsure: 1 };
  let score = Math.ceil(selectedFeatures.length / 3) + selectedIntegrations.length * 2 + Math.max(0, selectedPlatforms.length - 1) * 2 + (countWeight[answerText(answers, "userCount")] || 0);
  if (answerText(answers, "offline") === "yes") score += 3;
  if (answerText(answers, "migration") === "yes") score += 3;
  if (stage === "replace") score += 2;
  const complexity = score >= 13 ? "Alta" : score >= 6 ? "Media" : "Baja";

  const probableModules = unique([
    ...labels(answers, "features").filter((item) => !item.toLowerCase().includes("recomiende")),
    ...labels(answers, "processAreas"),
  ]).slice(0, 12);
  const nextSteps = [
    stage === "problem" || stage === "general" ? "Realizar una conversación de descubrimiento y validar el proceso principal." : "Validar el alcance y contrastarlo con los productos Lynex disponibles.",
    complexity === "Alta" ? "Separar una primera etapa y revisar dependencias e integraciones." : "Preparar una recomendación de sistema y plan inicial.",
    answerText(answers, "migration") === "yes" ? "Revisar una muestra de los datos que deberán migrarse." : "Confirmar responsables y fecha de activación.",
  ];

  return {
    projectType: preferredType(answers),
    complexity,
    probableModules: probableModules.length ? probableModules : ["Por definir durante el análisis"],
    platforms: labels(answers, "platforms").length ? labels(answers, "platforms") : ["Por definir"],
    integrations: labels(answers, "integrations").length ? labels(answers, "integrations") : ["Por definir"],
    priority: labels(answers, "priorities")[0] || "Por definir",
    definitionLevel: choiceLabel("ideaStage", stage),
    nextSteps,
  };
}

export function publicSummary(answers: IntakeAnswers, classification: IntakeClassification): IntakeSummary {
  const problem = answerText(answers, "problem") || answerText(answers, "processDescription") || answerText(answers, "feasibilityIdea") || "Por definir";
  const groups = labels(answers, "userGroups").join(", ");
  const count = labels(answers, "userCount")[0];
  return {
    projectType: classification.projectType,
    problem: problem.length > 180 ? `${problem.slice(0, 177)}…` : problem,
    users: [groups, count ? `${count} personas` : ""].filter(Boolean).join(" · ") || "Por definir",
    platforms: classification.platforms.join(", "),
    priority: classification.priority,
    stage: classification.definitionLevel,
  };
}
