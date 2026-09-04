import { ContactForm } from "@/components/contact-form";
import { FaqList } from "@/components/faq-list";
import { SiteNavigation } from "@/components/site-navigation";
import { offers, site, whatsappLink } from "@/lib/site";

// La página es estática, así que el año del pie quedaría congelado en el build.
// Regenerarla a diario mantiene el copyright correcto sin volver a desplegar.
export const revalidate = 86400;

const symptoms = [
  ["01", "No aparecés cuando te buscan", "Alguien escucha tu nombre, te busca en Google y no encuentra nada serio. Esa venta se pierde antes de empezar."],
  ["02", "La doble carga", "El pedido entra por WhatsApp, alguien lo pasa al Excel, otro al sistema de facturación. Tres veces el mismo dato, tres oportunidades de error."],
  ["03", "Los números llegan tarde", "Para saber cómo cerró el mes hay que esperar a que alguien arme el reporte a mano. Cuando llega, ya no sirve para decidir."],
] as const;

const steps = [
  ["01", "Conversamos", "Media hora para entender qué necesitás. Si vemos que no somos la solución correcta, te lo decimos y te orientamos igual."],
  ["02", "Propuesta por escrito", "Alcance, precio y fecha cerrados antes de empezar. Sin sorpresas después."],
  ["03", "Construimos por entregas", "Ves avances cada dos semanas. Nada de esperar meses para ver una caja negra."],
  ["04", "Publicamos y acompañamos", "Lo dejamos funcionando, capacitamos a tu equipo y seguimos disponibles."],
] as const;

const commitments = [
  ["Precio y fecha por escrito", "Antes de escribir la primera línea. Si el alcance cambia, se cotiza aparte y lo aprobás vos."],
  ["Entregas cada dos semanas", "Ves el avance real, no un informe. Si algo va por mal camino, te enterás a tiempo."],
  ["El código y los accesos son tuyos", "Al pago final se transfiere todo: repositorio, accesos y documentación. Nunca quedás atado a nosotros."],
  ["Garantía de 60 días", "Cualquier corrección sobre lo entregado entra sin costo durante los dos primeros meses."],
] as const;

const faqs = [
  ["¿Cuánto cuesta?", "Depende del alcance, y preferimos no inventar un número al aire. En la primera conversación te damos una referencia real, y la cifra exacta va por escrito antes de que te comprometas a nada."],
  ["¿Cuánto tarda?", "Un sitio web está publicado entre 2 y 4 semanas. Una primera versión útil de un sistema, entre 4 y 8 semanas desde el arranque."],
  ["¿De quién es el código?", "Tuyo. Al pago final se transfiere todo: repositorio, accesos y documentación. Nunca vas a quedar atado a nosotros."],
  ["¿Qué pasa si necesito cambios después?", "Los vas a necesitar, siempre pasa. Hay garantía de 60 días para correcciones y un abono mensual opcional que incluye horas de mejoras. Los cambios grandes se cotizan aparte, siempre antes de hacerlos."],
  ["¿Y si el proyecto se complica?", "Se paga por hitos contra entregas aprobadas. Nunca pagás por adelantado algo que todavía no viste funcionando."],
  ["¿Puedo empezar por algo chico?", "Sí, y suele ser lo mejor. Arrancamos por la parte que más duele, la dejamos funcionando, y desde ahí decidimos qué sigue."],
] as const;

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  }).replaceAll("<", "\\u003c");

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
            <p className="eyebrow"><span className="eyebrow-dot" /> {site.city}, {site.region}</p>
            <h1 id="hero-title">Tu negocio creció. Tus <em>herramientas</em> no.</h1>
            <p className="hero-text">Construimos la web y el sistema que tu empresa necesita. Sin plantillas genéricas, sin proyectos eternos y con el precio cerrado antes de empezar.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#servicios">Ver qué hacemos <Arrow /></a>
              {whatsappLink ? (
                <a className="text-link" href={whatsappLink} target="_blank" rel="noopener noreferrer">Escribinos por WhatsApp <Arrow /></a>
              ) : (
                <a className="text-link" href="#contacto">Contanos qué necesitás <Arrow /></a>
              )}
            </div>
            <div className="hero-note"><span aria-hidden="true">✦</span> Primera conversación de 30 minutos, sin compromiso</div>
          </div>

          <div className="hero-visual reveal-delay" aria-label="Panel de control ilustrativo de una solución empresarial" role="img">
            <div className="visual-top">
              <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="visual-label">LYNEX / DEMO OPERATIVA</span>
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

        <section className="trust-strip" aria-label="Lo que incluye todo proyecto">
          <div className="section-wrap trust-inner">
            <span>Lo que te llevás en todos los casos</span>
            <div><span>Precio cerrado</span><span>Entregas cada 2 semanas</span><span>El código es tuyo</span></div>
          </div>
        </section>

        <section className="section-wrap section-block" id="servicios" aria-labelledby="offers-title">
          <div className="section-intro">
            <div><p className="eyebrow">Dos formas de empezar</p><h2 id="offers-title">Elegí por dónde te <em>duele</em> más.</h2></div>
            <p>Podés empezar por la web y avanzar hacia un sistema cuando la operación lo necesite. No hace falta decidirlo todo hoy.</p>
          </div>
          <div className="offer-grid">
            {offers.map((offer) => (
              <article className="offer-card" key={offer.id} aria-labelledby={`offer-${offer.id}`}>
                <p className="eyebrow">{offer.eyebrow}</p>
                <h3 id={`offer-${offer.id}`}>{offer.title}</h3>
                <p className="offer-text">{offer.text}</p>
                <ul className="offer-includes">
                  {offer.includes.map((item) => (
                    <li key={item}><span aria-hidden="true">✓</span>{item}</li>
                  ))}
                </ul>
                <dl className="offer-meta">
                  {offer.from && (
                    <div><dt>Desde</dt><dd>{offer.from}</dd></div>
                  )}
                  <div><dt>Plazo</dt><dd>{offer.time}</dd></div>
                </dl>
                <a className="button button-dark offer-cta" href="#contacto">{offer.cta} <Arrow /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="dark-band" id="problemas" aria-labelledby="symptoms-title">
          <div className="section-wrap symptoms-layout">
            <div>
              <p className="eyebrow eyebrow-light">¿Esto te suena?</p>
              <h2 id="symptoms-title">Si reconocés alguno, ya sabemos por dónde <em>empezar.</em></h2>
              <p className="dark-copy">No hace falta que tengas todo claro antes de escribirnos. Parte de nuestro trabajo es ayudarte a ordenar el problema.</p>
              <a className="button button-light" href="#contacto">Hablemos de tu caso <Arrow /></a>
            </div>
            <ol className="symptom-list">
              {symptoms.map(([number, title, text]) => (
                <li key={number}>
                  <span className="symptom-number">{number}</span>
                  <div><strong>{title}</strong><p>{text}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section-wrap section-block process-section" id="proceso" aria-labelledby="process-title">
          <div className="section-intro">
            <div><p className="eyebrow">Cómo trabajamos</p><h2 id="process-title">Sin sorpresas de precio ni de <em>fecha.</em></h2></div>
            <p>Un proceso corto y transparente. Sabés qué estamos haciendo, por qué y qué viene después.</p>
          </div>
          <ol className="process-grid process-grid-four">
            {steps.map(([number, title, text]) => (
              <li className="process-step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></li>
            ))}
          </ol>
        </section>

        <section className="projects-band" id="garantias" aria-labelledby="commitments-title">
          <div className="section-wrap">
            <div className="section-intro project-intro">
              <div><p className="eyebrow">Nuestro compromiso</p><h2 id="commitments-title">Lo que te garantizamos por <em>escrito.</em></h2></div>
              <p>Todavía no publicamos casos de clientes. Mientras tanto, esto es lo que firmamos con cada proyecto.</p>
            </div>
            <ul className="commitment-grid">
              {commitments.map(([title, text]) => (
                <li key={title}><strong>{title}</strong><span>{text}</span></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section-wrap section-block why-section" id="nosotros" aria-labelledby="about-title">
          <div className="why-copy">
            <p className="eyebrow">Por qué Lynex</p>
            <h2 id="about-title">Hablás con quien <em>construye.</em></h2>
            <p>Somos un equipo chico en {site.city}. No vas a explicar tu problema tres veces ni a esperar que un intermediario te traduzca. La misma persona que entiende tu negocio es la que escribe el código.</p>
            <a className="text-link" href="#contacto">Escribinos <Arrow /></a>
          </div>
          <div className="why-list">
            <div><span>01</span><strong>Hecho para tu negocio</strong><p>No adaptás tu forma de trabajar a un producto. El producto se adapta a vos.</p></div>
            <div><span>02</span><strong>Te decimos que no</strong><p>Si lo que necesitás se resuelve con una herramienta que ya existe, te lo decimos aunque perdamos el proyecto.</p></div>
            <div><span>03</span><strong>Una base para crecer</strong><p>Construimos soluciones claras y mantenibles, preparadas para la siguiente etapa.</p></div>
          </div>
        </section>

        <section className="section-wrap faq-section" aria-labelledby="faq-title">
          <div className="section-intro">
            <div><p className="eyebrow">Preguntas frecuentes</p><h2 id="faq-title">Lo que querés saber <em>antes de empezar.</em></h2></div>
            <p>Una primera conversación no te compromete a nada. Solo sirve para entender si podemos ayudarte.</p>
          </div>
          <FaqList items={faqs} />
        </section>

        <section className="contact-section" id="contacto" aria-labelledby="contact-title">
          <div className="section-wrap contact-layout">
            <div>
              <p className="eyebrow eyebrow-light">Empecemos por entender el problema</p>
              <h2 id="contact-title">Una conversación de 30 minutos, sin <em>compromiso.</em></h2>
              <p>Contanos qué necesitás. Si vemos que no somos la solución correcta, te lo decimos y te orientamos igual.</p>
              <div className="contact-detail"><span aria-hidden="true">✦</span><a href={`mailto:${site.email}`}>{site.email}</a></div>
              {whatsappLink && (
                <div className="contact-detail"><span aria-hidden="true">✆</span><a href={whatsappLink} target="_blank" rel="noopener noreferrer">Escribinos por WhatsApp</a></div>
              )}
              <p className="contact-place">{site.city}, {site.region}</p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-wrap footer-inner">
          <a className="brand" href="#inicio" aria-label="Lynex, volver al inicio"><span className="brand-mark" aria-hidden="true">L</span><span>Lynex</span></a>
          <span>Webs y sistemas a medida. {site.city}, {site.region}.</span>
          <div>
            <a href="#servicios">Servicios</a>
            <a href="#contacto">Contacto</a>
            {site.linkedin && <a href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            <a href="/privacidad">Privacidad</a>
          </div>
          <small>© {new Date().getFullYear()} Lynex. Todos los derechos reservados.</small>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
    </>
  );
}
