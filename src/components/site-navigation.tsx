"use client";

import { useEffect, useState } from "react";

const links = [
  ["#servicios", "Servicios"],
  ["#soluciones", "Soluciones"],
  ["#proceso", "Proceso"],
  ["#resultados", "Resultados"],
  ["#nosotros", "Nosotros"],
];

export function SiteNavigation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="main-nav"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav
        id="main-nav"
        className={open ? "nav-open" : undefined}
        aria-label="Navegación principal"
      >
        {links.map(([href, label]) => (
          <a href={href} onClick={() => setOpen(false)} key={href}>
            {label}
          </a>
        ))}
        <a className="nav-cta" href="#contacto" onClick={() => setOpen(false)}>
          Hablemos <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </>
  );
}

