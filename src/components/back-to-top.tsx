"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const syncVisible = () => setVisible(window.scrollY > 900);

    syncVisible();
    window.addEventListener("scroll", syncVisible, { passive: true });

    return () => window.removeEventListener("scroll", syncVisible);
  }, []);

  return (
    <button
      className="back-to-top"
      data-visible={visible ? "true" : "false"}
      type="button"
      aria-label="Volver al inicio de la página"
      onClick={() => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      }}
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
