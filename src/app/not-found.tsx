import Link from "next/link";

export default function NotFound() {
  return (
    <main className="error-page">
      <span className="error-code">404</span>
      <h1>Esta página no existe.</h1>
      <p>Puede que el enlace haya cambiado o que la dirección no sea correcta.</p>
      <Link className="button button-dark" href="/">Volver al inicio <span aria-hidden="true">↗</span></Link>
    </main>
  );
}

