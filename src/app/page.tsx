"use client";

import { FormEvent, useState } from "react";

const services = [
  ["01", "Software a medida", "Procesos digitales que encajan con la forma real de trabajar de tu empresa.", "↗"],
  ["02", "Web y aplicaciones", "Experiencias web y móviles rápidas, claras y preparadas para crecer.", "⌁"],
  ["03", "Sistemas empresariales", "Una visión ordenada de ventas, clientes, operaciones y resultados.", "▦"],
  ["04", "Automatización", "Menos tareas repetitivas. Más tiempo para las decisiones que importan.", "◌"],
  ["05", "Integraciones y APIs", "Conectamos las herramientas que ya usas para que trabajen como un solo sistema.", "⇄"],
  ["06", "Evolución y soporte", "Acompañamiento continuo para que tu software nunca se quede atrás.", "＋"],
];

const solutions = ["Ventas", "Inventario", "Facturación", "CRM", "ERP", "Logística", "Pedidos", "Dashboards", "Portales internos", "Apps empresariales"];
const technologies = ["React", "Next.js", "Python", "Java", "Flutter", "PostgreSQL", "APIs REST", "Docker", "Cloud"];
const process = [
  ["01", "Descubrimiento", "Entendemos tu negocio, tus objetivos y el problema que quieres resolver."],
  ["02", "Análisis", "Convertimos necesidades y procesos en una hoja de ruta clara."],
  ["03", "Propuesta", "Definimos alcance, prioridades y una inversión transparente."],
  ["04", "Diseño y desarrollo", "Construimos, validamos contigo y avanzamos por entregas."],
  ["05", "Implementación", "Ponemos la solución en marcha y acompañamos al equipo."],
  ["06", "Evolución", "Medimos, mejoramos y sumamos nuevas capacidades cuando haga falta."],
];

const faqs = [
  ["¿Cuánto cuesta desarrollar un sistema?", "Cada proyecto parte de un problema y un alcance diferente. Después de una primera conversación podemos preparar una propuesta ajustada, con prioridades y fases claras."],
  ["¿Cuánto tarda?", "El plazo depende de la solución. Trabajamos por entregas para que puedas validar avances y empezar a obtener valor sin esperar a que todo esté terminado."],
  ["¿Puedo empezar con una versión pequeña?", "Sí. Diseñamos una primera versión enfocada en lo esencial y dejamos una base sólida para incorporar nuevas funciones después."],
  ["¿Pueden integrarlo con mis sistemas actuales?", "Sí. Analizamos tus herramientas y conectamos los sistemas necesarios mediante APIs o integraciones a medida."],
  ["¿Qué ocurre después de la implementación?", "Seguimos disponibles para soporte, mantenimiento y evolución. La solución se adapta a tu negocio a medida que cambia."],
  ["¿El código y los datos serán míos?", "Trabajamos con transparencia. El alcance de la propiedad, accesos y responsabilidades queda definido desde la propuesta."],
];

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [sent, setSent] = useState(false);

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Lynex, inicio"><span className="brand-mark">L</span><span>Lynex</span></a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}><span /> <span /> <span /><b className="sr-only">Abrir menú</b></button>
        <nav id="main-nav" className={menuOpen ? "nav-open" : ""} aria-label="Navegación principal">
          <a href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a><a href="#soluciones" onClick={() => setMenuOpen(false)}>Soluciones</a><a href="#proceso" onClick={() => setMenuOpen(false)}>Proceso</a><a href="#proyectos" onClick={() => setMenuOpen(false)}>Proyectos</a><a href="#nosotros" onClick={() => setMenuOpen(false)}>Nosotros</a>
          <a className="nav-cta" href="#contacto" onClick={() => setMenuOpen(false)}>Hablemos <Arrow /></a>
        </nav>
      </header>

      <section className="hero section-wrap" id="inicio">
        <div className="hero-copy reveal"><p className="eyebrow"><span className="eyebrow-dot" /> Software que trabaja como tu negocio</p><h1>La tecnología adecuada para <em>hacer avanzar</em> tu empresa.</h1><p className="hero-text">Diseñamos y desarrollamos software a medida para ordenar operaciones, automatizar procesos y tomar mejores decisiones.</p><div className="hero-actions"><a className="button button-dark" href="#contacto">Cuéntanos qué necesitas <Arrow /></a><a className="text-link" href="#servicios">Explorar servicios <Arrow /></a></div><div className="hero-note"><span>✦</span> Desde la primera conversación hasta la evolución del sistema</div></div>
        <div className="hero-visual reveal-delay" aria-label="Panel de control ilustrativo de una solución empresarial" role="img"><div className="visual-top"><span className="window-dots"><i /><i /><i /></span><span className="visual-label">LYNEX / OPERACIONES</span><span className="visual-status"><b /> Activo</span></div><div className="visual-content"><div className="visual-heading"><div><span className="small-label">Resumen operativo</span><strong>Todo en orden<span>.</span></strong></div><span className="date-pill">Este mes⌄</span></div><div className="metric-row"><div className="metric"><span>Pedidos procesados</span><strong>1.284</strong><b>+18,4%</b></div><div className="metric"><span>Tiempo ahorrado</span><strong>42<span>h</span></strong><b>+12,7%</b></div></div><div className="chart"><div className="chart-labels"><span>Rendimiento del sistema</span><span>Últimos 6 meses</span></div><div className="chart-area"><svg viewBox="0 0 440 130" preserveAspectRatio="none" aria-hidden="true"><path d="M0 110 C35 105, 48 80, 78 87 S125 105, 153 72 S198 87, 222 56 S261 71, 286 48 S330 60, 355 28 S400 37, 440 8" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M0 110 C35 105, 48 80, 78 87 S125 105, 153 72 S198 87, 222 56 S261 71, 286 48 S330 60, 355 28 S400 37, 440 8 V130 H0Z" fill="currentColor" opacity=".08" /></svg></div></div><div className="visual-bottom"><span><i className="avatar a1" /><i className="avatar a2" /><i className="avatar a3" /><b>+8</b> equipos conectados</span><span className="mini-arrow">↗</span></div></div></div>
      </section>

      <section className="trust-strip"><div className="section-wrap trust-inner"><span>Una solución bien diseñada se nota en todo</span><div><span>Más claridad</span><span>Menos fricción</span><span>Mejores decisiones</span></div></div></section>

      <section className="section-wrap section-block" id="servicios"><div className="section-intro"><div><p className="eyebrow">Lo que hacemos</p><h2>Software pensado para <em>resolver</em>, no para complicar.</h2></div><p>Combinamos estrategia, diseño y tecnología para convertir procesos complejos en herramientas que tu equipo disfruta usar.</p></div><div className="service-grid">{services.map(([number, title, text, icon]) => <article className="service-card" key={number}><div className="service-top"><span>{number}</span><b>{icon}</b></div><h3>{title}</h3><p>{text}</p><a href="#contacto" aria-label={`Conocer más sobre ${title}`}>Saber más <Arrow /></a></article>)}</div></section>

      <section className="dark-band" id="soluciones"><div className="section-wrap solutions-layout"><div><p className="eyebrow eyebrow-light">Un sistema, a tu medida</p><h2>Del problema cotidiano a una solución que <em>encaja.</em></h2><p className="dark-copy">No partimos de un catálogo cerrado. Observamos cómo funciona tu empresa y construimos las piezas que realmente necesitas.</p><a className="button button-light" href="#contacto">Hablemos de tu proyecto <Arrow /></a></div><div className="solution-list">{solutions.map((item, index) => <div key={item} className={index === 0 ? "solution active" : "solution"}><span className="solution-number">0{index + 1}</span><span>{item}</span><Arrow /></div>)}</div></div></section>

      <section className="section-wrap section-block process-section" id="proceso"><div className="section-intro"><div><p className="eyebrow">Cómo trabajamos</p><h2>Claridad en cada <em>paso.</em></h2></div><p>Un proceso cercano y transparente para que sepas qué estamos haciendo, por qué y qué viene después.</p></div><div className="process-grid">{process.map(([number, title, text]) => <div className="process-step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></section>

      <section className="projects-band" id="proyectos"><div className="section-wrap"><div className="section-intro project-intro"><div><p className="eyebrow">Proyectos</p><h2>El trabajo real empieza <em>escuchando.</em></h2></div><p>Estamos preparando una selección de casos para mostrar el contexto, la solución y el impacto de cada proyecto.</p></div><div className="project-placeholder"><div className="project-art"><span>LYNEX<br /><b>CASE STUDY</b></span><div className="art-lines"><i /><i /><i /></div></div><div className="project-info"><span className="tag">PRÓXIMAMENTE</span><h3>Casos de éxito en preparación</h3><p>Aquí encontrarás proyectos seleccionados con el reto, el enfoque y las decisiones que marcaron la diferencia.</p><a className="text-link" href="#contacto">Cuéntanos tu reto <Arrow /></a></div></div></div></section>

      <section className="section-wrap section-block why-section" id="nosotros"><div className="why-copy"><p className="eyebrow">Por qué Lynex</p><h2>Un socio tecnológico que habla tu <em>idioma.</em></h2><p>La tecnología es nuestra herramienta. Tu negocio, el punto de partida. Nos implicamos para que la solución sea útil hoy y sostenible mañana.</p><a className="text-link" href="#contacto">Conoce nuestra forma de trabajar <Arrow /></a></div><div className="why-list"><div><span>01</span><strong>Diseñado para tu negocio</strong><p>No adaptas tu forma de trabajar a un producto. El producto se adapta a ti.</p></div><div><span>02</span><strong>Comunicación directa</strong><p>Hablas con las personas que conocen tu proyecto y toman las decisiones.</p></div><div><span>03</span><strong>Una base para crecer</strong><p>Construimos soluciones claras, mantenibles y preparadas para la siguiente etapa.</p></div></div></section>

      <section className="tech-strip"><div className="section-wrap tech-inner"><p className="eyebrow">La tecnología, en su lugar</p><div className="tech-copy"><h2>Herramientas sólidas. <em>Resultados claros.</em></h2><p>Elegimos la tecnología que mejor responde a tu contexto. Nunca al revés.</p></div><div className="tech-tags">{technologies.map((tech) => <span key={tech}>{tech}</span>)}</div></div></section>

      <section className="section-wrap faq-section"><div className="section-intro"><div><p className="eyebrow">Preguntas frecuentes</p><h2>Lo que quieres saber <em>antes de empezar.</em></h2></div><p>Una primera conversación no te compromete a nada. Solo sirve para entender si podemos ayudarte.</p></div><div className="faq-list">{faqs.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? "faq-open" : ""}`} key={question}><button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>{question}</span><b>{openFaq === index ? "−" : "+"}</b></button>{openFaq === index && <p>{answer}</p>}</div>)}</div></section>

      <section className="contact-section" id="contacto"><div className="section-wrap contact-layout"><div><p className="eyebrow eyebrow-light">¿Tienes un reto?</p><h2>Hagamos que tu próximo paso sea <em>más claro.</em></h2><p>Cuéntanos qué necesitas. Te responderemos para concertar una primera conversación.</p><div className="contact-detail"><span>✦</span><a href="mailto:hola@lynex.dev">hola@lynex.dev</a></div></div><form className="contact-form" onSubmit={submitForm}>{sent ? <div className="form-success"><span>✓</span><h3>Mensaje recibido.</h3><p>Gracias por escribirnos. Te contactaremos para conocer mejor tu proyecto.</p><button type="button" className="text-link" onClick={() => setSent(false)}>Enviar otro mensaje</button></div> : <><div className="form-row"><label>Tu nombre<input required name="name" placeholder="Nombre y apellidos" /></label><label>Tu email<input required type="email" name="email" placeholder="nombre@empresa.com" /></label></div><label>¿En qué podemos ayudarte?<textarea required name="message" rows={4} placeholder="Cuéntanos brevemente tu proyecto o reto..." /></label><button className="button button-light form-submit" type="submit">Solicitar una conversación <Arrow /></button><small>Al enviar este formulario aceptas que usemos tus datos para responder a tu consulta.</small></>}</form></div></section>

      <footer className="site-footer"><div className="section-wrap footer-inner"><a className="brand" href="#inicio"><span className="brand-mark">L</span><span>Lynex</span></a><span>Software a medida para negocios que avanzan.</span><div><a href="#servicios">Servicios</a><a href="#contacto">Contacto</a></div><small>© 2026 Lynex. Todos los derechos reservados.</small></div></footer>
    </main>
  );
}
