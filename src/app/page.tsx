import Image from "next/image";
import Link from "next/link";
import { BrandWordmark } from "@/components/brand-wordmark";
import { ContactForm } from "@/components/contact-form";
import { FaqList } from "@/components/faq-list";
import { SiteNavigation } from "@/components/site-navigation";
import { offers, phoneLink, site, whatsappLink } from "@/lib/site";

const symptoms = [
  ["01", "No aparecés cuando te buscan", "Alguien escucha tu nombre, te busca en Google y no encuentra nada serio. Esa venta se pierde antes de empezar."],
  ["02", "La doble carga", "El pedido entra por WhatsApp, alguien lo pasa al Excel, otro al sistema de facturación. Tres veces el mismo dato, tres oportunidades de error."],
  ["03", "Los números llegan tarde", "Para saber cómo cerró el mes hay que esperar a que alguien arme el reporte a mano. Cuando llega, ya no sirve para decidir."],
] as const;

const steps = [
  ["01", "Conversamos", "Media hora para entender qué necesitás. Si vemos que no somos la solución correcta, te lo decimos y te orientamos igual."],
  ["02", "Definimos tu plan", "Funciones, precio mensual y fecha de activación quedan claros antes de empezar."],
  ["03", "Configuramos por etapas", "Ves avances frecuentes y validás que la solución responda a tu operación."],
  ["04", "Activamos y acompañamos", "Ponemos el servicio en marcha, capacitamos a tu equipo y seguimos mejorándolo con vos."],
] as const;

const commitments = [
  ["Plan y precio mensual claros", "La propuesta detalla qué incluye el servicio, cuánto cuesta por mes y qué puede modificar ese valor."],
  ["Puesta en marcha por etapas", "Ves el avance real y validás cada parte importante antes de activar el servicio completo."],
  ["Operación administrada", "Lynex se ocupa del hosting, mantenimiento y continuidad técnica para que tu equipo pueda usar la solución."],
  ["Acompañamiento continuo", "El soporte y las mejoras se gestionan dentro del plan contratado, con condiciones conocidas de antemano."],
] as const;

const faqs = [
  ["¿Cuánto cuesta?", "Trabajamos con planes mensuales. El valor depende del alcance, la cantidad de usuarios, las integraciones y el nivel de servicio. Después de la primera conversación recibís una propuesta clara antes de activar nada."],
  ["¿Cuánto tarda la activación?", "Un sitio web puede estar activo entre 2 y 4 semanas. Una primera versión de un sistema SaaS suele tomar entre 4 y 8 semanas desde el arranque."],
  ["¿Cómo funciona la suscripción?", "Contratás un plan que incluye el acceso a la solución y los servicios detallados en la propuesta. Lynex administra la operación, el mantenimiento y las actualizaciones correspondientes."],
  ["¿Qué pasa si necesito cambios después?", "Revisamos la necesidad y la incorporamos al servicio cuando entra en el plan. Si modifica el alcance, te informamos primero cómo cambia el precio mensual."],
  ["¿Qué pasa si necesito más usuarios o funciones?", "Ajustamos el plan a la nueva necesidad. El cambio de funciones, capacidad o soporte se acuerda antes de modificar el precio."],
  ["¿Puedo empezar por algo chico?", "Sí, y suele ser lo mejor. Activamos primero la parte que más duele y después revisamos juntos qué necesita la siguiente etapa."],
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
          <BrandWordmark gradientId="lynex-silver-header" />
          <span className="sr-only">Lynex</span>
        </a>
        <SiteNavigation />
      </header>

      <main id="contenido">
        <section className="hero section-wrap" id="inicio" aria-labelledby="hero-title">
          <div className="hero-copy reveal">
            <p className="eyebrow"><span className="eyebrow-dot" /> {site.city}, {site.region}</p>
            <h1 id="hero-title">Tu negocio creció. Tus <em>herramientas</em> no.</h1>
            <p className="hero-text">Activamos la web y el sistema SaaS que tu empresa necesita. Sin plantillas genéricas, con acompañamiento continuo y un plan mensual acorde a tu operación.</p>
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

          <div className="hero-visual reveal-delay">
            <Image
              className="hero-wordmark-image"
              src={`${site.basePath}/lynex-wordmark.svg`}
              alt="Lynex"
              width="1600"
              height="533"
              priority
            />
            <div
              className="visual-content"
              aria-label="Panel de control ilustrativo de una solución empresarial"
              role="img"
            >
              <div className="visual-top">
                <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
                <span className="visual-label">DEMO OPERATIVA</span>
                <span className="visual-status"><b /> Activo</span>
              </div>
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

        <section className="trust-strip" aria-label="Lo que incluye el servicio de Lynex">
          <div className="section-wrap trust-inner">
            <span>Lo que incluye el servicio</span>
            <div><span>Plan según tu operación</span><span>Mejoras continuas</span><span>Soporte de Lynex</span></div>
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
                  <div><dt>Plan mensual</dt><dd>{offer.monthlyPrice}</dd></div>
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
            <div><p className="eyebrow">Cómo trabajamos</p><h2 id="process-title">Un servicio claro desde el <em>inicio.</em></h2></div>
            <p>Sabés qué incluye tu plan, cuánto cuesta por mes y qué viene después de la activación.</p>
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
              <p>Todavía no publicamos casos de clientes. Mientras tanto, estos son los compromisos que acompañan cada plan.</p>
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
            <p>Somos un equipo chico en {site.city}. No vas a explicar tu problema tres veces ni a esperar que un intermediario te traduzca. La misma persona que entiende tu negocio configura y mejora tu solución.</p>
            <a className="text-link" href="#contacto">Escribinos <Arrow /></a>
          </div>
          <div className="why-list">
            <div><span>01</span><strong>Hecho para tu negocio</strong><p>No adaptás tu forma de trabajar a un producto. El producto se adapta a vos.</p></div>
            <div><span>02</span><strong>Te decimos que no</strong><p>Si lo que necesitás se resuelve con una herramienta que ya existe, te lo decimos aunque no contrates nuestro servicio.</p></div>
            <div><span>03</span><strong>Una base para crecer</strong><p>Construimos soluciones claras y mantenibles, preparadas para la siguiente etapa.</p></div>
          </div>
        </section>

        <section className="section-wrap faq-section" id="preguntas" aria-labelledby="faq-title">
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
              {phoneLink && (
                <div className="contact-detail"><span aria-hidden="true">✆</span><a href={phoneLink}>Llamar al {site.phone}</a></div>
              )}
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
          <a className="brand" href="#inicio" aria-label="Lynex, volver al inicio">
            <BrandWordmark gradientId="lynex-silver-footer" />
            <span className="sr-only">Lynex</span>
          </a>
          <span>Soluciones web y sistemas SaaS. {site.city}, {site.region}.</span>
          <div>
            <a href="#servicios">Servicios</a>
            <a href="#proceso">Proceso</a>
            <a href="#preguntas">Preguntas</a>
            <a href="#contacto">Contacto</a>
            {phoneLink && <a href={phoneLink}>Llamar</a>}
            {whatsappLink && <a href={whatsappLink} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
            {site.linkedin && <a href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            <Link href="/privacidad">Privacidad</Link>
          </div>
          <small>© {new Date().getFullYear()} Lynex. Todos los derechos reservados.</small>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
    </>
  );
}
