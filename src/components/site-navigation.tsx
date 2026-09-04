"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  ["#servicios", "Servicios"],
  ["#problemas", "Problemas"],
  ["#proceso", "Proceso"],
  ["#garantias", "Garantías"],
  ["#nosotros", "Nosotros"],
  ["#preguntas", "Preguntas"],
];

export function SiteNavigation() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function closeOnOutsideClick(event: PointerEvent) {
      const container = containerRef.current;
      if (container && !container.contains(event.target as Node)) setOpen(false);
    }

    function closeOnDesktop() {
      if (window.innerWidth > 800) setOpen(false);
    }

    // Con el menú desplegado, el fondo no debe poder desplazarse.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);
    document.addEventListener("pointerdown", closeOnOutsideClick);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [open]);

  return (
    <div className="nav-shell" ref={containerRef}>
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
    </div>
  );
}
