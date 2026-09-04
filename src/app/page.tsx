import { ContactForm } from "@/components/contact-form";
import { FaqList } from "@/components/faq-list";
import { SiteNavigation } from "@/components/site-navigation";
import { site } from "@/lib/site";

const services = [
  ["01", "Software a medida", "Procesos digitales que encajan con la forma real de trabajar de tu empresa.", "↗"],
  ["02", "Web y aplicaciones", "Experiencias web y móviles rápidas, claras y preparadas para crecer.", "⌁"],
  ["03", "Sistemas empresariales", "Una visión ordenada de ventas, clientes, operaciones y resultados.", "▦"],
  ["04", "Automatización", "Menos tareas repetitivas. Más tiempo para las decisiones que importan.", "◌"],
  ["05", "Integraciones y APIs", "Conectamos las herramientas que ya usas para que trabajen como un solo sistema.", "⇄"],
  ["06", "Evolución y soporte", "Acompañamiento continuo para que tu software nunca se quede atrás.", "＋"],
] as const;

const solutions = [
  "Ventas", "Inventario", "Facturación", "CRM", "ERP", "Logística", "Pedidos",
  "Dashboards", "Portales internos", "Apps empresariales",
] as const;

const technologies = [
  "React", "Next.js", "Python", "Java", "Flutter", "PostgreSQL", "APIs REST",
  "Docker", "Cloud",
] as const;

const process = [
  ["01", "Descubrimiento", "Entendemos tu negocio, tus objetivos y el problema que quieres resolver."],
  ["02", "Análisis", "Convertimos necesidades y procesos en una hoja de ruta clara."],
  ["03", "Propuesta", "Definimos alcance, prioridades y una inversión transparente."],
  ["04", "Diseño y desarrollo", "Construimos, validamos contigo y avanzamos por entregas."],
  ["05", "Implementación", "Ponemos la solución en marcha y acompañamos al equipo."],
  ["06", "Evolución", "Medimos, mejoramos y sumamos nuevas capacidades cuando haga falta."],
] as const;

const faqs = [
  ["¿Cuánto cuesta desarrollar un sistema?", "Cada proyecto parte de un problema y un alcance diferente. Después de una primera conversación podemos preparar una propuesta ajustada, con prioridades y fases claras."],
  ["¿Cuánto tarda?", "El plazo depende de la solución. Trabajamos por entregas para que puedas validar avances y empezar a obtener valor sin esperar a que todo esté terminado."],
  ["¿Puedo empezar con una versión pequeña?", "Sí. Diseñamos una primera versión enfocada en lo esencial y dejamos una base sólida para incorporar nuevas funciones después."],
  ["¿Pueden integrarlo con mis sistemas actuales?", "Sí. Analizamos tus herramientas y conectamos los sistemas necesarios mediante APIs o integraciones a medida."],
  ["¿Qué ocurre después de la implementación?", "Seguimos disponibles para soporte, mantenimiento y evolución. La solución se adapta a tu negocio a medida que cambia."],
  ["¿El código y los datos serán míos?", "Trabajamos con transparencia. El alcance de la propiedad, accesos y responsabilidades queda definido desde la propuesta."],
] as const;

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Lynex, inicio">
          <span className="brand-mark" aria-hidden="true">L</span><span>Lynex</span>
        </a>
        <SiteNavigation />
      </header>

      <main id="contenido">
        <section className="hero section-wrap" id="inicio" aria-labelledby="hero-title">
          <div className="hero-copy reveal">
            <p className="eyebrow"><span className="eyebrow-dot" /> Software que trabaja como tu negocio</p>
            <h1 id="hero-title">La tecnología adecuada para <em>hacer avanzar</em> tu empresa.</h1>
            <p className="hero-text">Diseñamos y desarrollamos software a medida para ordenar operaciones, automatizar procesos y tomar mejores decisiones.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#contacto">Cuéntanos qué necesitas <Arrow /></a>
              <a className="text-link" href="#servicios">Explorar servicios <Arrow /></a>
            </div>
            <div className="hero-note"><span aria-hidden="true">✦</span> Desde la primera conversación hasta la evolución del sistema</div>
          </div>

          <div className="hero-visual reveal-delay" aria-label="Panel de control ilustrativo de una solución empresarial" role="img">
            <div className="visual-top">
              <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="visual-label">LYNEX / OPERACIONES</span>
              <span className="visual-status"><b /> Activo</span>
            </div>
            <div className="visual-content">
              <div className="visual-heading">
                <div><span className="small-label">Resumen operativo</span><strong>Todo en orden<span>.</span></strong></div>
                <span className="date-pill">Este mes⌄</span>
              </div>
              <div className="metric-row">
                <div className="metric"><span>Pedidos procesados</span><strong>1.284</strong><b>+18,4%</b></div>
                <div className="metric"><span>Tiempo ahorrado</span><strong>42<span>h</span></strong><b>+12,7%</b></div>
              </div>
              <div className="chart">
                <div className="chart-labels"><span>Rendimiento del sistema</span><span>Últimos 6 meses</span></div>
                <div className="chart-area">
                  <svg viewBox="0 0 440 130" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M0 110 C35 105, 48 80, 78 87 S125 105, 153 72 S198 87, 222 56 S261 71, 286 48 S330 60, 355 28 S400 37, 440 8" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path d="M0 110 C35 105, 48 80, 78 87 S125 105, 153 72 S198 87, 222 56 S261 71, 286 48 S330 60, 355 28 S400 37, 440 8 V130 H0Z" fill="currentColor" opacity=".08" />
                  </svg>
                </div>
              </div>
              <div className="visual-bottom">
                <span><i className="avatar a1" /><i className="avatar a2" /><i className="avatar a3" /><b>+8</b> equipos conectados</span>
                <span className="mini-arrow" aria-hidden="true">↗</span>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Beneficios">
          <div className="section-wrap trust-inner">
            <span>Una solución bien diseñada se nota en todo</span>
            <div><span>Más claridad</span><span>Menos fricción</span><span>Mejores decisiones</span></div>
          </div>
        </section>

        <section className="section-wrap section-block" id="servicios" aria-labelledby="services-title">
          <div className="section-intro">
            <div><p className="eyebrow">Lo que hacemos</p><h2 id="services-title">Software pensado para <em>resolver</em>, no para complicar.</h2></div>
            <p>Combinamos estrategia, diseño y tecnología para convertir procesos complejos en herramientas que tu equipo disfruta usar.</p>
          </div>
          <div className="service-grid">
            {services.map(([number, title, text, icon]) => (
              <article className="service-card" key={number}>
                <div className="service-top"><span>{number}</span><b aria-hidden="true">{icon}</b></div>
                <h3>{title}</h3><p>{text}</p>
                <a href="#contacto" aria-label={`Conocer más sobre ${title}`}>Saber más <Arrow /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="dark-band" id="soluciones" aria-labelledby="solutions-title">
          <div className="section-wrap solutions-layout">
            <div>
              <p className="eyebrow eyebrow-light">Un sistema, a tu medida</p>
              <h2 id="solutions-title">Del problema cotidiano a una solución que <em>encaja.</em></h2>
              <p className="dark-copy">No partimos de un catálogo cerrado. Observamos cómo funciona tu empresa y construimos las piezas que realmente necesitas.</p>
              <a className="button button-light" href="#contacto">Hablemos de tu proyecto <Arrow /></a>
            </div>
            <ol className="solution-list">
              {solutions.map((item, index) => (
                <li key={item} className={index === 0 ? "solution active" : "solution"}>
                  <span className="solution-number">{String(index + 1).padStart(2, "0")}</span><span>{item}</span><Arrow />
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section-wrap section-block process-section" id="proceso" aria-labelledby="process-title">
          <div className="section-intro">
            <div><p className="eyebrow">Cómo trabajamos</p><h2 id="process-title">Claridad en cada <em>paso.</em></h2></div>
            <p>Un proceso cercano y transparente para que sepas qué estamos haciendo, por qué y qué viene después.</p>
          </div>
          <ol className="process-grid">
            {process.map(([number, title, text]) => (
              <li className="process-step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></li>
            ))}
          </ol>
        </section>

        <section className="projects-band" id="resultados" aria-labelledby="results-title">
          <div className="section-wrap">
            <div className="section-intro project-intro">
              <div><p className="eyebrow">Resultados</p><h2 id="results-title">Tecnología con un propósito <em>concreto.</em></h2></div>
              <p>Cada decisión técnica debe traducirse en una mejora que tu equipo pueda ver, usar y medir.</p>
            </div>
            <div className="project-placeholder">
              <div className="project-art">
                <span>DE LA FRICCIÓN<br /><b>AL FLUJO</b></span>
                <div className="art-lines" aria-hidden="true"><i /><i /><i /></div>
              </div>
              <div className="project-info">
                <span className="tag">NUESTRO COMPROMISO</span>
                <h3>Software que mejora la operación</h3>
                <ul className="outcome-list">
                  <li><strong>Visibilidad</strong><span>Información centralizada para decidir con contexto.</span></li>
                  <li><strong>Eficiencia</strong><span>Menos tareas manuales y menos margen de error.</span></li>
                  <li><strong>Escalabilidad</strong><span>Una base mantenible que crece con el negocio.</span></li>
                </ul>
                <a className="text-link" href="#contacto">Cuéntanos tu reto <Arrow /></a>
              </div>
            </div>
          </div>
        </section>

        <section className="section-wrap section-block why-section" id="nosotros" aria-labelledby="about-title">
          <div className="why-copy">
            <p className="eyebrow">Por qué Lynex</p>
            <h2 id="about-title">Un socio tecnológico que habla tu <em>idioma.</em></h2>
            <p>La tecnología es nuestra herramienta. Tu negocio, el punto de partida. Nos implicamos para que la solución sea útil hoy y sostenible mañana.</p>
            <a className="text-link" href="#contacto">Conoce nuestra forma de trabajar <Arrow /></a>
          </div>
          <div className="why-list">
            <div><span>01</span><strong>Diseñado para tu negocio</strong><p>No adaptas tu forma de trabajar a un producto. El producto se adapta a ti.</p></div>
            <div><span>02</span><strong>Comunicación directa</strong><p>Hablas con las personas que conocen tu proyecto y toman las decisiones.</p></div>
            <div><span>03</span><strong>Una base para crecer</strong><p>Construimos soluciones claras, mantenibles y preparadas para la siguiente etapa.</p></div>
          </div>
        </section>

        <section className="tech-strip" aria-labelledby="technology-title">
          <div className="section-wrap tech-inner">
            <p className="eyebrow">La tecnología, en su lugar</p>
            <div className="tech-copy"><h2 id="technology-title">Herramientas sólidas. <em>Resultados claros.</em></h2><p>Elegimos la tecnología que mejor responde a tu contexto. Nunca al revés.</p></div>
            <div className="tech-tags">{technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
          </div>
        </section>

        <section className="section-wrap faq-section" aria-labelledby="faq-title">
          <div className="section-intro">
            <div><p className="eyebrow">Preguntas frecuentes</p><h2 id="faq-title">Lo que quieres saber <em>antes de empezar.</em></h2></div>
            <p>Una primera conversación no te compromete a nada. Solo sirve para entender si podemos ayudarte.</p>
          </div>
          <FaqList items={faqs} />
        </section>

        <section className="contact-section" id="contacto" aria-labelledby="contact-title">
          <div className="section-wrap contact-layout">
            <div>
              <p className="eyebrow eyebrow-light">¿Tienes un reto?</p>
              <h2 id="contact-title">Hagamos que tu próximo paso sea <em>más claro.</em></h2>
              <p>Cuéntanos qué necesitas. Te responderemos para concertar una primera conversación.</p>
              <div className="contact-detail"><span aria-hidden="true">✦</span><a href={`mailto:${site.email}`}>{site.email}</a></div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-wrap footer-inner">
          <a className="brand" href="#inicio" aria-label="Lynex, volver al inicio"><span className="brand-mark" aria-hidden="true">L</span><span>Lynex</span></a>
          <span>Software a medida para negocios que avanzan.</span>
          <div><a href="#servicios">Servicios</a><a href="#contacto">Contacto</a><a href="/privacidad">Privacidad</a></div>
          <small>© {new Date().getFullYear()} Lynex. Todos los derechos reservados.</small>
        </div>
      </footer>
    </>
  );
}
