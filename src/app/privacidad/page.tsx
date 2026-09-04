import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo tratamos los datos enviados mediante los canales de contacto de Lynex.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="legal-wrap">
        <Link className="brand" href="/" aria-label="Lynex, volver al inicio">
          <span className="brand-mark" aria-hidden="true">L</span><span>Lynex</span>
        </Link>
        <p className="eyebrow">Privacidad</p>
        <h1>Política de privacidad</h1>
        <p className="legal-updated">Última actualización: 4 de septiembre de 2026.</p>

        <section>
          <h2>Quién trata tus datos</h2>
          <p>Lynex es responsable de los datos que enviás mediante nuestros canales de contacto. Podés escribirnos en <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
        </section>
        <section>
          <h2>Qué datos recopilamos y para qué</h2>
          <p>Cuando nos escribís recibimos tu nombre, correo electrónico y el contenido de tu consulta. Los usamos exclusivamente para responderte, evaluar tu solicitud y continuar la conversación comercial que hayas iniciado.</p>
        </section>
        <section>
          <h2>Conservación y proveedores</h2>
          <p>Conservamos la información durante el tiempo necesario para gestionar la consulta y las obligaciones que puedan derivarse de ella. El envío del mensaje puede ser procesado por proveedores técnicos de alojamiento y correo, bajo nuestras instrucciones.</p>
        </section>
        <section>
          <h2>Tus opciones</h2>
          <p>Podés pedir acceso, corrección o eliminación de tus datos, o retirar tu consentimiento, escribiendo a <a href={`mailto:${site.email}`}>{site.email}</a>. No usamos tus datos para suscribirte a comunicaciones de marketing.</p>
        </section>
        <section>
          <h2>Cookies</h2>
          <p>Este sitio no instala cookies publicitarias ni de analítica. El proveedor de alojamiento puede conservar registros técnicos necesarios para la seguridad y el funcionamiento del servicio.</p>
        </section>
        <Link className="button button-dark legal-back" href="/">← Volver al inicio</Link>
      </div>
    </main>
  );
}
