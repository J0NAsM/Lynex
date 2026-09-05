import type { Metadata } from "next";
import Link from "next/link";
import {
  allChoiceGroups,
  answerList,
  answerText,
  choiceLabel,
  type IntakeAnswers,
} from "@/lib/intake-options";
import { hasAdminSession, isAdminConfigured } from "@/lib/server/admin-auth";
import { listIntakes, type StoredIntake } from "@/lib/server/intake-store";
import styles from "./pedidos.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pedidos",
  robots: { index: false, follow: false },
};

const choiceFields: Partial<Record<string, keyof typeof allChoiceGroups>> = {
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

const detailSections = [
  ["Cliente", [
    ["contactName", "Nombre"], ["company", "Empresa"], ["contactEmail", "Correo"],
    ["contactPhone", "Teléfono / WhatsApp"], ["contactLocation", "Ciudad / país"],
    ["contactPreference", "Contacto preferido"],
  ]],
  ["Pedido", [
    ["ideaStage", "Punto de partida"], ["systemTypes", "Tipo de sistema"],
    ["systemDescription", "Descripción del sistema"], ["ideaDescription", "Descripción de la idea"],
    ["feasibilityIdea", "Idea por evaluar"], ["problem", "Problema principal"],
    ["processAreas", "Procesos involucrados"], ["processDescription", "Proceso actual"],
    ["painPoints", "Dificultades"],
  ]],
  ["Operación", [
    ["currentTools", "Herramientas actuales"], ["userGroups", "Personas usuarias"],
    ["userCount", "Cantidad de personas"], ["userFlow", "Recorrido esperado"],
    ["features", "Funciones"], ["platforms", "Plataformas"], ["offline", "Uso sin internet"],
    ["integrations", "Integraciones"],
  ]],
  ["Sistema actual y materiales", [
    ["currentSystem", "Sistema actual"], ["systemStrengths", "Qué funciona bien"],
    ["systemImprovements", "Qué quiere mejorar"], ["slowTasks", "Tareas difíciles"],
    ["migration", "Migración"], ["existingData", "Datos existentes"],
    ["currentAssets", "Material disponible"],
  ]],
  ["Prioridades y preferencias", [
    ["essential1", "Imprescindible 1"], ["essential2", "Imprescindible 2"],
    ["essential3", "Imprescindible 3"], ["priorities", "Prioridades"],
    ["designStyle", "Estilo"], ["styleReferences", "Referencias"],
    ["visualIdentity", "Identidad visual"],
  ]],
  ["Plazo y resultado", [
    ["idealStart", "Inicio ideal"], ["deadline", "Fecha límite"], ["budget", "Inversión"],
    ["successOutcome", "Resultado esperado"],
  ]],
] as const;

function displayAnswer(answers: IntakeAnswers, field: string) {
  const choiceField = choiceFields[field];
  if (choiceField) {
    return answerList(answers, field).map((value) => choiceLabel(choiceField, value)).join(", ");
  }
  return answerText(answers, field);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-PY", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Asuncion",
  }).format(new Date(value));
}

function Login({ error }: { error?: string }) {
  const messages: Record<string, string> = {
    config: "Configurá ADMIN_PASSWORD y ADMIN_SESSION_SECRET en el servidor.",
    invalid: "La contraseña no es correcta.",
    limited: "Demasiados intentos. Esperá 15 minutos antes de volver a probar.",
  };

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <span className={styles.logo}>LYN<span>E</span>X</span>
        <p className={styles.kicker}>Acceso privado</p>
        <h1>Panel de pedidos</h1>
        <p>Ingresá tu contraseña para consultar la información enviada desde la web.</p>
        {error && messages[error] && <div className={styles.error} role="alert">{messages[error]}</div>}
        {!isAdminConfigured() && <div className={styles.notice}>El acceso administrativo todavía no está configurado.</div>}
        <form action="/api/admin/session" method="post" className={styles.loginForm}>
          <label htmlFor="admin-password">Contraseña</label>
          <input id="admin-password" name="password" type="password" autoComplete="current-password" required autoFocus />
          <button type="submit">Ingresar <span aria-hidden="true">→</span></button>
        </form>
        <Link href="/">Volver al sitio</Link>
      </section>
    </main>
  );
}

function Detail({ order }: { order: StoredIntake }) {
  return (
    <article className={styles.detail}>
      <header className={styles.detailHeader}>
        <div>
          <p>{order.id}</p>
          <h2>{answerText(order.answers, "contactName") || "Pedido sin nombre"}</h2>
          <span>{formatDate(order.createdAt)}</span>
        </div>
        <div className={styles.classification}>
          <span>{order.classification.projectType}</span>
          <span>Complejidad {order.classification.complexity.toLowerCase()}</span>
        </div>
      </header>

      <div className={styles.quickContact}>
        <a href={`mailto:${answerText(order.answers, "contactEmail")}`}>{answerText(order.answers, "contactEmail")}</a>
        <a href={`tel:${answerText(order.answers, "contactPhone").replace(/[^+\d]/g, "")}`}>{answerText(order.answers, "contactPhone")}</a>
      </div>

      {detailSections.map(([title, fields]) => {
        const rows = fields
          .map(([field, label]) => ({ field, label, value: displayAnswer(order.answers, field) }))
          .filter((row) => row.value);
        if (!rows.length) return null;
        return <section className={styles.detailSection} key={title}>
          <h3>{title}</h3>
          <dl>{rows.map((row) => <div key={row.field}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
        </section>;
      })}

      <section className={styles.detailSection}>
        <h3>Análisis automático</h3>
        <dl>
          <div><dt>Prioridad</dt><dd>{order.classification.priority}</dd></div>
          <div><dt>Nivel de definición</dt><dd>{order.classification.definitionLevel}</dd></div>
          <div><dt>Módulos probables</dt><dd>{order.classification.probableModules.join(", ")}</dd></div>
          <div><dt>Próximos pasos</dt><dd>{order.classification.nextSteps.join(" · ")}</dd></div>
        </dl>
      </section>

      {order.files.length > 0 && <section className={styles.detailSection}>
        <h3>Archivos adjuntos</h3>
        <ul className={styles.files}>{order.files.map((file, index) => <li key={file.storedName}>
          <a href={`/admin/pedidos/${order.id}/archivos/${index}`}>{file.name}</a>
          <span>{Math.ceil(file.size / 1024)} KB</span>
        </li>)}</ul>
      </section>}
    </article>
  );
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[]; error?: string | string[] }>;
}) {
  const query = await searchParams;
  const error = typeof query.error === "string" ? query.error : undefined;
  if (!(await hasAdminSession())) return <Login error={error} />;

  const orders = await listIntakes();
  const requestedId = typeof query.id === "string" ? query.id : "";
  const selected = orders.find((order) => order.id === requestedId) || orders[0];

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div><span className={styles.logo}>LYN<span>E</span>X</span><b>Pedidos</b></div>
        <nav aria-label="Administración">
          <Link href="/">Ver sitio</Link>
          <form action="/api/admin/logout" method="post"><button type="submit">Cerrar sesión</button></form>
        </nav>
      </header>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}><h1>Pedidos recibidos</h1><span>{orders.length}</span></div>
          {orders.length === 0 ? <p className={styles.emptyList}>Todavía no se recibió ningún pedido.</p> : <ol className={styles.orderList}>
            {orders.map((order) => {
              const active = selected?.id === order.id;
              return <li key={order.id}><Link className={active ? styles.active : ""} href={`/admin/pedidos?id=${order.id}`}>
                <strong>{answerText(order.answers, "contactName") || "Sin nombre"}</strong>
                <span>{order.classification.projectType}</span>
                <small>{formatDate(order.createdAt)}</small>
              </Link></li>;
            })}
          </ol>}
        </aside>
        <section className={styles.content}>
          {selected ? <Detail order={selected} /> : <div className={styles.empty}><span>✦</span><h2>No hay pedidos para mostrar</h2><p>Los nuevos pedidos aparecerán aquí automáticamente.</p></div>}
        </section>
      </div>
    </main>
  );
}
