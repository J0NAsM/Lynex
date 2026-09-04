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
  ["01", "Conocemos tu necesidad", "Media hora para entender cómo trabajás y qué problema querés resolver."],
  ["02", "Te mostramos la opción adecuada", "Elegís el sistema o servicio Lynex y el plan que corresponde a tu operación."],
  ["03", "Preparamos la activación", "Configuramos usuarios, opciones disponibles y datos iniciales según el servicio contratado."],
  ["04", "Activamos y acompañamos", "Tu equipo empieza a usarlo con capacitación, soporte y actualizaciones continuas."],
] as const;

const commitments = [
  ["Plan y precio mensual claros", "La propuesta detalla qué incluye el servicio, cuánto cuesta por mes y qué puede modificar ese valor."],
  ["Activación acompañada", "Preparamos el servicio, ayudamos con la puesta en marcha y capacitamos a las personas que van a usarlo."],
  ["Operación administrada", "Lynex se ocupa del hosting, mantenimiento y continuidad técnica de sus productos."],
  ["Evolución continua", "El plan incluye el soporte y las actualizaciones correspondientes al sistema contratado."],
] as const;

const faqs = [
  ["¿Cuánto cuesta?", "Cada cliente paga una suscripción mensual por usar el sistema o servicio elegido. El precio depende del producto, el plan, la cantidad de usuarios y el nivel de soporte."],
  ["¿Me construyen un sistema exclusivo?", "No. Contratás el acceso a uno de los sistemas desarrollados y administrados por Lynex. Configuramos las opciones disponibles para que puedas empezar a usarlo en tu empresa."],
  ["¿Cómo funciona la suscripción?", "Mientras tu plan esté activo, podés usar el sistema contratado y recibís el mantenimiento, las actualizaciones y el soporte incluidos en ese plan."],
  ["¿Cuánto tarda la activación?", "Depende del sistema, la configuración, la carga inicial de datos y la capacitación necesaria. La propuesta indica el plazo antes de contratar."],
  ["¿Qué pasa si necesito más usuarios o funciones?", "Podés cambiar a un plan que incluya lo que necesitás. Te informamos el nuevo precio mensual antes de hacer el cambio."],
  ["¿Puedo empezar por algo chico?", "Sí. Podés comenzar con el sistema y el plan más adecuados para la necesidad actual, y cambiar de plan cuando haga falta."],
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
            <p className="hero-text">Elegí el sistema Lynex que necesita tu empresa y usalo mediante una suscripción mensual. Nosotros nos ocupamos de mantenerlo, actualizarlo y acompañar a tu equipo.</p>
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
            <div><span>Sistemas Lynex</span><span>Suscripción mensual</span><span>Soporte continuo</span></div>
          </div>
        </section>

        <section className="section-wrap section-block" id="servicios" aria-labelledby="offers-title">
          <div className="section-intro">
            <div><p className="eyebrow">Dos formas de empezar</p><h2 id="offers-title">Elegí por dónde te <em>duele</em> más.</h2></div>
            <p>Podés contratar una presencia web administrada o el acceso a uno de nuestros sistemas. No necesitás encargar un desarrollo desde cero.</p>
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
            <div><p className="eyebrow">Cómo funciona</p><h2 id="process-title">Del sistema adecuado a tu equipo, <em>sin vueltas.</em></h2></div>
            <p>Elegís un producto Lynex, contratás el plan y pagás mensualmente mientras lo usás.</p>
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
            <h2 id="about-title">Hablás con el equipo del <em>producto.</em></h2>
            <p>Somos un equipo chico en {site.city}. Conocemos los sistemas que ofrecemos y te ayudamos a elegir, activar y aprovechar el que mejor responda a tu necesidad.</p>
            <a className="text-link" href="#contacto">Escribinos <Arrow /></a>
          </div>
          <div className="why-list">
            <div><span>01</span><strong>El plan adecuado</strong><p>Te mostramos qué sistema y qué nivel de servicio corresponden a tu situación actual.</p></div>
            <div><span>02</span><strong>Recomendación honesta</strong><p>Si ninguno de nuestros productos resuelve bien tu necesidad, te lo decimos con claridad.</p></div>
            <div><span>03</span><strong>Producto en evolución</strong><p>Los sistemas reciben mantenimiento y actualizaciones continuas mientras los clientes los usan.</p></div>
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
          <span>Sistemas Lynex por suscripción mensual. {site.city}, {site.region}.</span>
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
