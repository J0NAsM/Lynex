"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Choice, IntakeAnswers, answerList, answerText, budgets, contactPreferences,
  currentAssets, currentTools, designStyles, existingData, features, ideaStages,
  integrations, migrationOptions, offlineOptions, painPoints, platforms,
  priorities, processAreas, startDates, systemTypes, userCounts, userGroups,
  visualIdentity,
} from "@/lib/intake-options";
import { site, whatsappLink } from "@/lib/site";

type FormState = "idle" | "submitting" | "success" | "error";
type SimpleStep = {
  id: string;
  kind: "single" | "multi" | "text" | "textarea";
  title: string;
  help?: string;
  choices?: Choice[];
  placeholder?: string;
  optional?: boolean;
  minLength?: number;
};
type CustomStep = {
  id: string;
  kind: "users" | "platforms" | "design" | "replacement" | "information" |
    "mvp" | "ranking" | "timing" | "contact" | "review" | "guidance";
  title: string;
  help?: string;
};
type Step = SimpleStep | CustomStep;
type IntakeSummary = {
  projectType: string;
  problem: string;
  users: string;
  platforms: string;
  priority: string;
  stage: string;
};

const DRAFT_KEY = "lynex-intake-draft-v1";
const MAX_FILES = 5;
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_TOTAL_BYTES = 15 * 1024 * 1024;
const ACCEPTED_FILES = ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.txt";

const textStep = (id: string, title: string, help: string, placeholder: string, minLength = 15): Step =>
  ({ id, kind: "textarea", title, help, placeholder, minLength });

const sharedFinish: Step[] = [
  { id: "timing", kind: "timing", title: "¿Cuándo te gustaría empezar?", help: "La fecha límite es opcional. Una estimación aproximada ya nos sirve." },
  { id: "budget", kind: "single", title: "¿Tenés definido un rango de inversión?", help: "No hace falta definir una cifra ahora. Los rangos se ajustarán cuando Lynex publique sus planes.", choices: budgets },
  textStep("successOutcome", "¿Cómo sabrías que esto fue un éxito?", "Por ejemplo: reducir tareas manuales, atender más clientes, evitar errores o centralizar la información.", "El proyecto sería un éxito si…"),
  { id: "contact", kind: "contact", title: "¿Cómo podemos contactarte?", help: "Pedimos estos datos recién ahora, después de entender tu necesidad." },
  { id: "review", kind: "review", title: "Confirmá tu pedido", help: "Revisá los datos y volvé a cualquier paso si necesitás cambiar algo." },
];

function detailedSteps(isReplacement: boolean): Step[] {
  return [
    { id: "systemTypes", kind: "multi", title: "¿Qué tipo de sistema imaginás?", help: "Podés elegir varias opciones. Si no estás seguro, también está bien.", choices: systemTypes },
    textStep("systemDescription", "Describí con tus palabras qué debería hacer", "No hace falta utilizar términos técnicos. Contanos cómo imaginás que debería funcionar.", "Por ejemplo: necesito ordenar los pedidos que hoy llegan por WhatsApp…", 20),
    textStep("problem", "¿Qué problema querés resolver?", "Esta respuesta nos ayuda a entender la necesidad real, más allá de la solución imaginada.", "Contanos qué está pasando y por qué querés cambiarlo…", 15),
    { id: "currentTools", kind: "multi", title: "¿Cómo realizan actualmente ese trabajo?", help: "Elegí todas las herramientas o formas de trabajo que correspondan.", choices: currentTools },
    { id: "users", kind: "users", title: "¿Quiénes utilizarán el sistema?", help: "Indicá los perfiles y una cantidad aproximada de personas." },
    textStep("userFlow", "Imaginá que el sistema ya existe. ¿Qué haría una persona de principio a fin?", "Ejemplo: “El cliente inicia sesión, selecciona un servicio, elige fecha, paga y recibe una confirmación”.", "Una persona ingresa al sistema y…", 20),
    { id: "features", kind: "multi", title: "¿Qué funciones imaginás que debería tener?", help: "Elegí todas las que reconozcas o pedinos una recomendación.", choices: features },
    { id: "platforms", kind: "platforms", title: "¿Dónde debería funcionar?", help: "También necesitamos saber si debe seguir funcionando sin internet." },
    { id: "design", kind: "design", title: "¿Cómo imaginás el sistema?", help: "El estilo, las referencias y la identidad visual nos ayudan a entender la experiencia que esperás." },
    ...(isReplacement ? [{ id: "replacement", kind: "replacement", title: "Contanos sobre el sistema que querés reemplazar", help: "Queremos conservar lo que funciona y entender dónde están hoy las mayores fricciones." } satisfies Step] : []),
    { id: "integrations", kind: "multi", title: "¿Debe conectarse con algo que ya utilizás?", help: "Podés elegir varias integraciones o indicar que todavía no estás seguro.", choices: integrations },
    { id: "information", kind: "information", title: "¿Qué información y materiales ya tenés?", help: "Podés adjuntar documentos, planillas, capturas o diagramas. Los archivos no se guardan en el autoguardado del navegador." },
    { id: "mvp", kind: "mvp", title: "Si la primera versión tuviera solo 3 cosas, ¿cuáles serían imprescindibles?", help: "Esto nos permite distinguir lo esencial de lo que puede incorporarse después." },
    { id: "ranking", kind: "ranking", title: "¿Qué es más importante para vos?", help: "Ordená las prioridades: la primera tendrá mayor peso en nuestro análisis." },
    ...sharedFinish,
  ];
}

function guidedSteps(): Step[] {
  return [
    textStep("ideaDescription", "Contanos la idea que tenés en mente", "No tiene que estar completa. Escribí lo que ya imaginaste y nosotros te ayudamos a ordenarlo.", "Mi idea es…", 20),
    textStep("problem", "¿Qué problema querés resolver?", "Pensá en el resultado que esperás, no en términos técnicos.", "Hoy sucede que…", 15),
    { id: "currentTools", kind: "multi", title: "¿Cómo realizan actualmente ese trabajo?", help: "Podés elegir más de una opción.", choices: currentTools },
    { id: "users", kind: "users", title: "¿Quiénes lo utilizarían?", help: "Una aproximación es suficiente." },
    textStep("userFlow", "¿Cómo imaginás el recorrido principal?", "Contanos qué debería poder hacer una persona desde que ingresa hasta que termina su tarea.", "Una persona ingresa y…", 15),
    { id: "systemTypes", kind: "multi", title: "¿Hay algún tipo de sistema que ya tengas en mente?", help: "Elegí “No estoy seguro” si preferís nuestra recomendación.", choices: systemTypes },
    { id: "platforms", kind: "platforms", title: "¿Dónde debería funcionar?", help: "No pasa nada si todavía no lo definiste." },
    { id: "integrations", kind: "multi", title: "¿Necesitaría conectarse con otras herramientas?", help: "Elegí lo que ya conozcas o pedinos asesoramiento.", choices: integrations },
    { id: "mvp", kind: "mvp", title: "¿Cuáles serían las 3 cosas más importantes?", help: "No tienen que ser funciones técnicas; también pueden ser resultados concretos." },
    { id: "ranking", kind: "ranking", title: "¿Qué es más importante para vos?", help: "Ordená las prioridades según tu situación." },
    ...sharedFinish,
  ];
}

function problemSteps(): Step[] {
  return [
    { id: "processAreas", kind: "multi", title: "¿Qué parte de tu actividad querés mejorar?", help: "Elegí uno o varios procesos.", choices: processAreas },
    textStep("processDescription", "Contanos qué sucede actualmente y qué te gustaría mejorar", "No necesitás saber qué software hace falta. Describí el trabajo como ocurre hoy.", "Actualmente hacemos… y nos gustaría…", 20),
    { id: "currentTools", kind: "multi", title: "¿Cómo realizan hoy ese trabajo?", help: "Podés elegir varias opciones.", choices: currentTools },
    { id: "painPoints", kind: "multi", title: "¿Qué es lo que más dificulta el proceso?", help: "Seleccioná todos los problemas que reconozcas.", choices: painPoints },
    { id: "users", kind: "users", title: "¿Quiénes participan en este proceso?", help: "Incluí a quienes trabajan dentro de la empresa y a clientes si corresponde." },
    { id: "guidance", kind: "guidance", title: "No necesitás saber qué software necesitás", help: "Lynex analizará tu proceso y te propondrá el sistema y el plan más adecuados." },
    ...sharedFinish,
  ];
}

function feasibilitySteps(): Step[] {
  return [
    textStep("feasibilityIdea", "¿Qué idea querés evaluar?", "Contanos qué debería suceder, para quién y en qué contexto.", "Quisiera saber si es posible…", 20),
    textStep("problem", "¿Qué problema resolvería esa idea?", "Si todavía no lo tenés claro, explicanos qué resultado te gustaría conseguir.", "La idea ayudaría a…", 10),
    { id: "systemTypes", kind: "multi", title: "¿Con qué tipo de solución la relacionás?", help: "Podés marcar “No estoy seguro / quiero asesoramiento”.", choices: systemTypes },
    { id: "users", kind: "users", title: "¿Quiénes la utilizarían?", help: "Una estimación aproximada es suficiente." },
    { id: "information", kind: "information", title: "¿Ya tenés material para evaluar la idea?", help: "Podés adjuntar documentos, bocetos, capturas o diagramas." },
    ...sharedFinish,
  ];
}

function getSteps(answers: IntakeAnswers): Step[] {
  const first: Step = { id: "ideaStage", kind: "single", title: "¿Qué querés pedirle a Lynex?", help: "Elegí el punto de partida que mejor describe tu necesidad. Con eso armaremos un pedido a tu medida.", choices: ideaStages };
  const stage = answerText(answers, "ideaStage");
  if (stage === "clear") return [first, ...detailedSteps(false)];
  if (stage === "replace") return [first, ...detailedSteps(true)];
  if (stage === "general") return [first, ...guidedSteps()];
  if (stage === "problem") return [first, ...problemSteps()];
  if (stage === "feasibility") return [first, ...feasibilitySteps()];
  return [first];
}

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function selectedLabel(options: Choice[], value: string) {
  return options.find((option) => option.value === value)?.label || "Sin definir";
}

export function ContactForm() {
  if (site.staticHosting && !site.intakeApiUrl) return <StaticContact />;
  return <IntakeWizard />;
}

function StaticContact() {
  const subject = encodeURIComponent("Pedido de servicio desde la web de Lynex");
  return <div className="contact-form static-contact">
    <p className="eyebrow">Pedido de servicio</p>
    <h3>Pedí la solución que necesitás.</h3>
    <p>Enviá tu pedido por correo o WhatsApp. Te ayudaremos a definir el sistema y el plan adecuados antes de confirmar cualquier contratación.</p>
    <div className="static-contact-actions">
      <a className="button button-dark" href={`mailto:${site.email}?subject=${subject}`}>Realizar pedido por correo <span aria-hidden="true">↗</span></a>
      {whatsappLink && <a className="button button-outline" href={whatsappLink} target="_blank" rel="noopener noreferrer">Realizar pedido por WhatsApp <span aria-hidden="true">↗</span></a>}
    </div>
    <small>El configurador de pedidos se habilita cuando su envío seguro está conectado.</small>
  </div>;
}

function IntakeWizard() {
  const [answers, setAnswers] = useState<IntakeAnswers>({ priorities: priorities.map((item) => item.value) });
  const [files, setFiles] = useState<File[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [stepError, setStepError] = useState("");
  const [summary, setSummary] = useState<IntakeSummary | null>(null);
  const [requestId, setRequestId] = useState("");
  const [direction, setDirection] = useState<"next" | "back">("next");
  const mountedAt = useRef<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const steps = useMemo(() => getSteps(answers), [answers]);
  const safeIndex = Math.min(stepIndex, steps.length - 1);
  const step = steps[safeIndex];
  const progress = steps.length === 1 ? 5 : Math.round(((safeIndex + 1) / steps.length) * 100);

  useEffect(() => {
    mountedAt.current = Date.now();
    try {
      const draft = window.localStorage.getItem(DRAFT_KEY);
      if (!draft) return;
      const parsed = JSON.parse(draft) as { answers?: IntakeAnswers; stepIndex?: number };
      const timer = window.setTimeout(() => {
        if (parsed.answers && typeof parsed.answers === "object") setAnswers({ priorities: priorities.map((item) => item.value), ...parsed.answers });
        if (typeof parsed.stepIndex === "number") setStepIndex(Math.max(0, parsed.stepIndex));
      }, 0);
      return () => window.clearTimeout(timer);
    } catch { window.localStorage.removeItem(DRAFT_KEY); }
  }, []);
  useEffect(() => {
    if (state !== "success") window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ answers, stepIndex: safeIndex }));
  }, [answers, safeIndex, state]);
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, [safeIndex, state]);

  function setAnswer(field: string, value: string | string[]) {
    setAnswers((current) => ({ ...current, [field]: value }));
    setStepError(""); setError("");
  }
  function toggleAnswer(field: string, value: string) {
    const selected = answerList(answers, field);
    setAnswer(field, selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  }
  function validateStep(current: Step) {
    const missing = "Elegí o completá una respuesta para continuar.";
    if (current.kind === "single" || current.kind === "multi") return current.optional || answerList(answers, current.id).length ? "" : missing;
    if (current.kind === "text" || current.kind === "textarea") {
      const minimum = current.minLength || 2;
      return current.optional || answerText(answers, current.id).length >= minimum ? "" : `Contanos un poco más (mínimo ${minimum} caracteres).`;
    }
    if (current.kind === "users") return answerList(answers, "userGroups").length && answerText(answers, "userCount") ? "" : missing;
    if (current.kind === "platforms") return answerList(answers, "platforms").length && answerText(answers, "offline") ? "" : missing;
    if (current.kind === "design") return answerText(answers, "designStyle") && answerText(answers, "visualIdentity") ? "" : missing;
    if (current.kind === "replacement") return answerText(answers, "currentSystem").length >= 2 && answerText(answers, "systemImprovements").length >= 10 && answerText(answers, "migration") ? "" : "Indicá el sistema actual, qué querés mejorar y si necesitás migrar información.";
    if (current.kind === "information") return answerList(answers, "existingData").length && answerList(answers, "currentAssets").length ? "" : missing;
    if (current.kind === "mvp") return ["essential1", "essential2", "essential3"].every((field) => answerText(answers, field).length >= 3) ? "" : "Completá las tres cosas imprescindibles.";
    if (current.kind === "timing") return answerText(answers, "idealStart") ? "" : missing;
    if (current.kind === "contact") {
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answerText(answers, "contactEmail"));
      return answerText(answers, "contactName").length >= 2 && validEmail && answerText(answers, "contactPhone").replace(/\D/g, "").length >= 6 && answerText(answers, "contactLocation").length >= 2 && answerText(answers, "contactPreference") ? "" : "Completá nombre, email, teléfono, ciudad/país y preferencia de contacto.";
    }
    return "";
  }
  function goNext() {
    const validation = validateStep(step);
    if (validation) { setStepError(validation); return; }
    setDirection("next"); setStepIndex((current) => Math.min(current + 1, steps.length - 1)); setStepError("");
  }
  function goBack() {
    setDirection("back"); setStepIndex((current) => Math.max(0, current - 1)); setStepError(""); setError("");
  }
  function chooseFiles(event: ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(event.target.files || []);
    const combined = [...files, ...incoming].slice(0, MAX_FILES);
    const total = combined.reduce((sum, file) => sum + file.size, 0);
    if (combined.some((file) => file.size > MAX_FILE_BYTES) || total > MAX_TOTAL_BYTES || files.length + incoming.length > MAX_FILES) {
      setStepError("Podés adjuntar hasta 5 archivos, de 8 MB cada uno y 15 MB en total."); event.target.value = ""; return;
    }
    setFiles(combined); setStepError(""); event.target.value = "";
  }
  function movePriority(index: number, offset: number) {
    const order = answerList(answers, "priorities").length ? answerList(answers, "priorities") : priorities.map((item) => item.value);
    const target = index + offset;
    if (target < 0 || target >= order.length) return;
    const next = [...order]; [next[index], next[target]] = [next[target], next[index]]; setAnswer("priorities", next);
  }
  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateStep(step);
    if (validation) { setStepError(validation); return; }
    if (!site.intakeApiUrl) {
      setState("error"); setError("El envío seguro todavía no está conectado al servidor de Lynex. Tu pedido sigue guardado en este dispositivo."); return;
    }
    setState("submitting"); setError("");
    const body = new FormData();
    body.set("payload", JSON.stringify(answers));
    body.set("elapsed", String(mountedAt.current === null ? 0 : Date.now() - mountedAt.current));
    body.set("website", answerText(answers, "website"));
    files.forEach((file) => body.append("files", file, file.name));
    try {
      const response = await fetch(site.intakeApiUrl, { method: "POST", body });
      const result = (await response.json()) as { message?: string; id?: string; summary?: IntakeSummary };
      if (!response.ok || !result.id || !result.summary) throw new Error(result.message || "No pudimos registrar la solicitud.");
      setRequestId(result.id); setSummary(result.summary); setState("success"); window.localStorage.removeItem(DRAFT_KEY);
    } catch (caught) {
      setState("error"); setError(caught instanceof Error ? caught.message : "No pudimos registrar la solicitud. Intentá nuevamente.");
    }
  }

  if (state === "success" && summary) {
    return <div className="intake-shell intake-success" role="status" aria-live="polite">
      <span className="success-mark" aria-hidden="true">✓</span><p className="eyebrow">Pedido recibido · {requestId}</p>
      <h3 ref={headingRef} tabIndex={-1}>Tu pedido ya está en manos de Lynex.</h3>
      <p>Revisaremos la información y nos pondremos en contacto para confirmar el sistema, el plan y los próximos pasos. Enviar este pedido no genera ningún cobro.</p>
      <dl className="intake-summary-grid">
        <div><dt>Necesidad</dt><dd>{summary.projectType}</dd></div><div><dt>Problema principal</dt><dd>{summary.problem}</dd></div>
        <div><dt>Usuarios</dt><dd>{summary.users}</dd></div><div><dt>Plataformas</dt><dd>{summary.platforms}</dd></div>
        <div><dt>Prioridad</dt><dd>{summary.priority}</dd></div><div><dt>Estado</dt><dd>{summary.stage}</dd></div>
      </dl>
      <button type="button" className="button button-light" onClick={() => { setAnswers({ priorities: priorities.map((item) => item.value) }); setFiles([]); setStepIndex(0); setSummary(null); setState("idle"); mountedAt.current = Date.now(); }}>Realizar otro pedido <span aria-hidden="true">↗</span></button>
    </div>;
  }

  return <form className="intake-shell" onSubmit={submitForm} noValidate>
    <div className="intake-progress-head"><span>Pedido de servicio Lynex</span><span>Paso {safeIndex + 1}{steps.length > 1 ? ` de ${steps.length}` : ""}</span></div>
    <div className="intake-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label={`${progress}% completado`}><span style={{ width: `${progress}%` }} /></div>
    <section className={`intake-step intake-step-${direction}`} key={step.id} aria-labelledby={`step-${step.id}`}>
      <p className="eyebrow">Pedido {progress}% preparado</p><h3 id={`step-${step.id}`} ref={headingRef} tabIndex={-1}>{step.title}</h3>{step.help && <p className="intake-help">{step.help}</p>}
      {(step.kind === "single" || step.kind === "multi") && step.choices && <ChoiceGrid options={step.choices} selected={answerList(answers, step.id)} multiple={step.kind === "multi"} onChoose={(value) => step.kind === "multi" ? toggleAnswer(step.id, value) : setAnswer(step.id, value)} />}
      {(step.kind === "text" || step.kind === "textarea") && <label className="intake-field"><span className="sr-only">{step.title}</span>{step.kind === "textarea" ? <textarea value={answerText(answers, step.id)} onChange={(event) => setAnswer(step.id, event.target.value)} rows={7} maxLength={5000} placeholder={step.placeholder} autoFocus /> : <input value={answerText(answers, step.id)} onChange={(event) => setAnswer(step.id, event.target.value)} maxLength={500} placeholder={step.placeholder} autoFocus />}<small>{answerText(answers, step.id).length} caracteres</small></label>}
      {step.kind === "users" && <div className="intake-stack"><ChoiceGrid options={userGroups} selected={answerList(answers, "userGroups")} multiple onChoose={(value) => toggleAnswer("userGroups", value)} /><fieldset className="intake-subquestion"><legend>¿Cuántas personas aproximadamente?</legend><ChoiceGrid options={userCounts} selected={answerList(answers, "userCount")} onChoose={(value) => setAnswer("userCount", value)} compact /></fieldset></div>}
      {step.kind === "platforms" && <div className="intake-stack"><ChoiceGrid options={platforms} selected={answerList(answers, "platforms")} multiple onChoose={(value) => toggleAnswer("platforms", value)} /><fieldset className="intake-subquestion"><legend>¿Necesitás que funcione sin conexión a internet?</legend><ChoiceGrid options={offlineOptions} selected={answerList(answers, "offline")} onChoose={(value) => setAnswer("offline", value)} compact /></fieldset></div>}
      {step.kind === "design" && <div className="intake-stack"><ChoiceGrid options={designStyles} selected={answerList(answers, "designStyle")} onChoose={(value) => setAnswer("designStyle", value)} compact /><label className="intake-field"><span>¿Hay alguna aplicación o página cuyo estilo te guste? <i>Opcional</i></span><input value={answerText(answers, "styleReferences")} onChange={(event) => setAnswer("styleReferences", event.target.value)} maxLength={1000} placeholder="Pegá enlaces o escribí nombres" /></label><fieldset className="intake-subquestion"><legend>¿Ya tenés identidad visual?</legend><ChoiceGrid options={visualIdentity} selected={answerList(answers, "visualIdentity")} onChoose={(value) => setAnswer("visualIdentity", value)} compact /></fieldset></div>}
      {step.kind === "replacement" && <div className="intake-stack"><label className="intake-field"><span>¿Qué sistema utilizás actualmente?</span><input value={answerText(answers, "currentSystem")} onChange={(event) => setAnswer("currentSystem", event.target.value)} maxLength={500} placeholder="Nombre del sistema o breve descripción" /></label><label className="intake-field"><span>¿Qué cosas funcionan bien? <i>Opcional</i></span><textarea value={answerText(answers, "systemStrengths")} onChange={(event) => setAnswer("systemStrengths", event.target.value)} rows={3} maxLength={2000} /></label><label className="intake-field"><span>¿Qué querés mejorar?</span><textarea value={answerText(answers, "systemImprovements")} onChange={(event) => setAnswer("systemImprovements", event.target.value)} rows={3} maxLength={2000} /></label><label className="intake-field"><span>¿Qué tareas son lentas, repetitivas o difíciles? <i>Opcional</i></span><textarea value={answerText(answers, "slowTasks")} onChange={(event) => setAnswer("slowTasks", event.target.value)} rows={3} maxLength={2000} /></label><fieldset className="intake-subquestion"><legend>¿Necesitás migrar información?</legend><ChoiceGrid options={migrationOptions} selected={answerList(answers, "migration")} onChoose={(value) => setAnswer("migration", value)} compact /></fieldset></div>}
      {step.kind === "information" && <div className="intake-stack"><fieldset className="intake-subquestion"><legend>Información para incorporar</legend><ChoiceGrid options={existingData} selected={answerList(answers, "existingData")} multiple onChoose={(value) => toggleAnswer("existingData", value)} compact /></fieldset><fieldset className="intake-subquestion"><legend>Estado actual</legend><ChoiceGrid options={currentAssets} selected={answerList(answers, "currentAssets")} multiple onChoose={(value) => toggleAnswer("currentAssets", value)} compact /></fieldset><label className="file-picker"><input type="file" accept={ACCEPTED_FILES} multiple onChange={chooseFiles} /><span>Adjuntar archivos</span><small>PDF, Word, Excel o imágenes · máximo 5 archivos / 15 MB</small></label>{files.length > 0 && <ul className="file-list">{files.map((file, index) => <li key={`${file.name}-${file.size}`}><span>{file.name}<small>{formatBytes(file.size)}</small></span><button type="button" onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Quitar ${file.name}`}>×</button></li>)}</ul>}</div>}
      {step.kind === "mvp" && <div className="mvp-list">{[1, 2, 3].map((number) => <label key={number}><b>{number}</b><input value={answerText(answers, `essential${number}`)} onChange={(event) => setAnswer(`essential${number}`, event.target.value)} maxLength={500} placeholder="Imprescindible…" /></label>)}</div>}
      {step.kind === "ranking" && <ol className="priority-list">{answerList(answers, "priorities").map((value, index, order) => <li key={value}><b>{index + 1}</b><span>{selectedLabel(priorities, value)}</span><div><button type="button" disabled={index === 0} onClick={() => movePriority(index, -1)} aria-label={`Subir ${selectedLabel(priorities, value)}`}>↑</button><button type="button" disabled={index === order.length - 1} onClick={() => movePriority(index, 1)} aria-label={`Bajar ${selectedLabel(priorities, value)}`}>↓</button></div></li>)}</ol>}
      {step.kind === "timing" && <div className="intake-stack"><ChoiceGrid options={startDates} selected={answerList(answers, "idealStart")} onChoose={(value) => setAnswer("idealStart", value)} compact /><label className="intake-field"><span>¿Existe una fecha límite importante? <i>Opcional</i></span><input type="date" value={answerText(answers, "deadline")} onChange={(event) => setAnswer("deadline", event.target.value)} /></label></div>}
      {step.kind === "guidance" && <div className="guidance-card"><span aria-hidden="true">✦</span><p>Analizaremos el problema, las personas involucradas y el resultado que esperás. Con eso podemos recomendarte una solución concreta sin que tengas que definirla técnicamente.</p></div>}
      {step.kind === "contact" && <div className="contact-fields"><label className="intake-field"><span>Nombre y apellido</span><input autoComplete="name" value={answerText(answers, "contactName")} onChange={(event) => setAnswer("contactName", event.target.value)} maxLength={80} /></label><label className="intake-field"><span>Empresa <i>Opcional</i></span><input autoComplete="organization" value={answerText(answers, "company")} onChange={(event) => setAnswer("company", event.target.value)} maxLength={120} /></label><label className="intake-field"><span>Email</span><input type="email" autoComplete="email" value={answerText(answers, "contactEmail")} onChange={(event) => setAnswer("contactEmail", event.target.value)} maxLength={254} placeholder="nombre@empresa.com" /></label><label className="intake-field"><span>Teléfono / WhatsApp</span><input type="tel" autoComplete="tel" value={answerText(answers, "contactPhone")} onChange={(event) => setAnswer("contactPhone", event.target.value)} maxLength={30} placeholder="+595…" /></label><label className="intake-field"><span>Ciudad / País</span><input autoComplete="address-level2" value={answerText(answers, "contactLocation")} onChange={(event) => setAnswer("contactLocation", event.target.value)} maxLength={120} /></label><fieldset className="intake-subquestion contact-preference"><legend>¿Cómo preferís que te contactemos?</legend><ChoiceGrid options={contactPreferences} selected={answerList(answers, "contactPreference")} onChoose={(value) => setAnswer("contactPreference", value)} compact /></fieldset><label className="form-honeypot" aria-hidden="true">Sitio web<input name="website" tabIndex={-1} autoComplete="off" value={answerText(answers, "website")} onChange={(event) => setAnswer("website", event.target.value)} /></label></div>}
      {step.kind === "review" && <Review answers={answers} files={files} onEdit={(id) => { const index = steps.findIndex((item) => item.id === id); if (index >= 0) { setDirection("back"); setStepIndex(index); } }} />}
    </section>
    {(stepError || error) && <p className="form-error" role="alert">{stepError || error}{error && whatsappLink && <> También podés <a href={whatsappLink} target="_blank" rel="noopener noreferrer">hablarnos por WhatsApp</a>.</>}</p>}
    <div className="intake-actions"><button type="button" className="button intake-back" onClick={goBack} disabled={safeIndex === 0 || state === "submitting"}>← Atrás</button>{step.kind === "review" ? <button type="submit" className="button button-light" disabled={state === "submitting"}>{state === "submitting" ? "Enviando pedido…" : "Enviar pedido a Lynex"}<span aria-hidden="true">↗</span></button> : <button type="button" className="button button-light" onClick={goNext}>Agregar y continuar <span aria-hidden="true">→</span></button>}</div>
    <p className="autosave-note"><span aria-hidden="true">✓</span> Tu pedido se guarda automáticamente en este dispositivo.</p>
    <small className="privacy-note">Usamos tus datos únicamente para analizar y responder tu solicitud. Consultá nuestra <Link href="/privacidad">política de privacidad</Link>.</small>
  </form>;
}

function ChoiceGrid({ options, selected, multiple = false, compact = false, onChoose }: { options: Choice[]; selected: string[]; multiple?: boolean; compact?: boolean; onChoose: (value: string) => void }) {
  return <div className={`choice-grid${compact ? " choice-grid-compact" : ""}`}>{options.map((option) => { const active = selected.includes(option.value); return <button key={option.value} type="button" className={`choice-card${active ? " selected" : ""}`} aria-pressed={active} onClick={() => onChoose(option.value)}><span className="choice-indicator" aria-hidden="true">{active ? "✓" : multiple ? "+" : "○"}</span><span><strong>{option.label}</strong>{option.description && <small>{option.description}</small>}</span></button>; })}</div>;
}

function Review({ answers, files, onEdit }: { answers: IntakeAnswers; files: File[]; onEdit: (id: string) => void }) {
  const stage = answerText(answers, "ideaStage");
  const type = answerList(answers, "systemTypes").map((value) => selectedLabel(systemTypes, value)).join(", ") || answerList(answers, "processAreas").map((value) => selectedLabel(processAreas, value)).join(", ") || "Proyecto por definir";
  const problem = answerText(answers, "problem") || answerText(answers, "processDescription") || answerText(answers, "feasibilityIdea");
  const reviewItems = [
    ["ideaStage", "Etapa", selectedLabel(ideaStages, stage)],
    [stage === "problem" ? "processAreas" : "systemTypes", "Necesidad", type],
    [stage === "problem" ? "processDescription" : "problem", "Problema principal", problem],
    ["users", "Usuarios", answerList(answers, "userGroups").map((value) => selectedLabel(userGroups, value)).join(", ")],
    ["timing", "Inicio ideal", selectedLabel(startDates, answerText(answers, "idealStart"))],
    ["contact", "Contacto", `${answerText(answers, "contactName")} · ${answerText(answers, "contactPreference") ? selectedLabel(contactPreferences, answerText(answers, "contactPreference")) : ""}`],
  ].filter((item) => item[2]);
  return <div className="review-list">{reviewItems.map(([id, label, value]) => <div key={label}><span><small>{label}</small><strong>{value}</strong></span><button type="button" onClick={() => onEdit(id)}>Editar</button></div>)}{files.length > 0 && <div><span><small>Archivos adjuntos</small><strong>{files.length} archivo{files.length === 1 ? "" : "s"}</strong></span><button type="button" onClick={() => onEdit("information")}>Editar</button></div>}</div>;
}
