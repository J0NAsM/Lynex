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
  const [activeSection, setActiveSection] = useState("");
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

  useEffect(() => {
    if (typeof IntersectionObserver !== "function") return;

    const sections = links
      .map(([href]) => document.querySelector<HTMLElement>(href))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    // Franja angosta al medio de la pantalla: la sección que la cruza es la
    // que la persona está mirando y la que se marca en el menú.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    for (const section of sections) observer.observe(section);

    return () => observer.disconnect();
  }, []);

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
          <a
            href={href}
            onClick={() => setOpen(false)}
            key={href}
            aria-current={activeSection === href ? "true" : undefined}
          >
            {label}
          </a>
        ))}
        <a className="nav-cta" href="#contacto" onClick={() => setOpen(false)}>
          Realizar pedido <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </div>
  );
}
