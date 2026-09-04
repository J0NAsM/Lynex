"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled root error", error);
  }, [error]);

  return (
    <html lang="es-PY">
      <body>
        <main className="error-page">
          <span className="error-code">Error</span>
          <h1>Algo se rompió de nuestro lado.</h1>
          <p>No es culpa tuya. Probá recargar la página en unos segundos.</p>
          <button className="button button-dark" type="button" onClick={reset}>
            Reintentar <span aria-hidden="true">↗</span>
          </button>
        </main>
      </body>
    </html>
  );
}
