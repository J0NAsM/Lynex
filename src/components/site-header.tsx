"use client";

import { useEffect, useState } from "react";
import { BrandWordmark } from "@/components/brand-wordmark";
import { SiteNavigation } from "@/components/site-navigation";

/**
 * Cabecera fija: en una portada larga la navegación y el botón de pedido
 * tienen que seguir a mano sin volver arriba.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const syncScrolled = () => setScrolled(window.scrollY > 24);

    syncScrolled();
    window.addEventListener("scroll", syncScrolled, { passive: true });

    return () => window.removeEventListener("scroll", syncScrolled);
  }, []);

  return (
    <header className="site-header" data-scrolled={scrolled ? "true" : "false"}>
      <a className="brand" href="#inicio" aria-label="Lynex, inicio">
        <BrandWordmark gradientId="lynex-silver-header" />
        <span className="sr-only">Lynex</span>
      </a>
      <SiteNavigation />
    </header>
  );
}
