"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled page error", error);
  }, [error]);

  return (
    <main className="error-page">
      <span className="error-code">Error</span>
      <h1>Algo se rompió de nuestro lado.</h1>
      <p>
        No es culpa tuya. Podés reintentar; si vuelve a fallar, escribinos y lo revisamos.
      </p>
      <div className="hero-actions">
        <button className="button button-dark" type="button" onClick={reset}>
          Reintentar <span aria-hidden="true">↗</span>
        </button>
        <Link className="text-link" href="/">
          Volver al inicio <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </main>
  );
}
