"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./intro-splash.module.css";

type IntroPhase = "playing" | "leaving" | "finished";

const SEEN_KEY = "lynex-intro-v1";

// Corre mientras el navegador analiza el HTML, antes de que la intro se pinte:
// si ya se vio en esta sesión marca el documento y el CSS la oculta sin parpadeo.
const earlyHideScript =
  `try{if(sessionStorage.getItem(${JSON.stringify(SEEN_KEY)}))` +
  `document.documentElement.setAttribute("data-intro-seen","")}catch(e){}`;

export function IntroSplash() {
  const [phase, setPhase] = useState<IntroPhase>("playing");
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const releaseScrollRef = useRef<() => void>(() => {});

  const skip = useCallback(() => {
    setPhase((current) => (current === "playing" ? "leaving" : current));
  }, []);

  useEffect(() => {
    // Una sola vez por sesión. El script en línea ya la ocultó por CSS, así que
    // acá solo queda desmontarla sin bloquear el scroll ni programar timers.
    if (document.documentElement.hasAttribute("data-intro-seen")) {
      const unmountTimer = window.setTimeout(() => setPhase("finished"), 0);
      return () => window.clearTimeout(unmountTimer);
    }

    const viewport = viewportRef.current;
    const stage = stageRef.current;

    if (!viewport || !stage) return;

    const fitLogo = () => {
      const scale = Math.min(
        viewport.clientWidth / 900,
        viewport.clientHeight / 260,
        1,
      );

      stage.style.setProperty("--stage-scale", String(scale));
    };

    fitLogo();
    window.addEventListener("resize", fitLogo);

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    let scrollReleased = false;
    const releaseScroll = () => {
      if (scrollReleased) return;
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      scrollReleased = true;
    };

    releaseScrollRef.current = releaseScroll;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fadeDelay = reducedMotion ? 80 : 2600;

    const fadeTimer = window.setTimeout(skip, fadeDelay);

    // Cualquier gesto de la persona corta la intro: nadie debería esperar.
    const skipEvents = ["pointerdown", "keydown", "wheel", "touchmove"] as const;
    for (const type of skipEvents) {
      window.addEventListener(type, skip, { passive: true });
    }

    return () => {
      window.removeEventListener("resize", fitLogo);
      window.clearTimeout(fadeTimer);
      for (const type of skipEvents) window.removeEventListener(type, skip);
      releaseScroll();
    };
  }, [skip]);

  useEffect(() => {
    if (phase === "playing") return;

    // El scroll se libera apenas empieza la salida, no al terminarla.
    releaseScrollRef.current();
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Sesión sin almacenamiento disponible: la intro simplemente se repite.
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "leaving") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finishTimer = window.setTimeout(() => setPhase("finished"), reducedMotion ? 20 : 700);

    return () => window.clearTimeout(finishTimer);
  }, [phase]);

  if (phase === "finished") return null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: earlyHideScript }} />
      <div
        className={`${styles.splash}${phase === "leaving" ? ` ${styles.leaving}` : ""}`}
        id="intro-splash"
        aria-hidden="true"
      >
        <div className={styles.viewport} ref={viewportRef}>
          <div className={styles.stage} ref={stageRef}>
            <div className={styles.ambient} />

            <div className={`${styles.piece} ${styles.lVertical}`} />
            <div className={`${styles.piece} ${styles.lBase}`} />

            <div className={`${styles.piece} ${styles.yLeft}`} />
            <div className={`${styles.piece} ${styles.yRight}`} />
            <div className={`${styles.piece} ${styles.yStem}`} />

            <div className={`${styles.piece} ${styles.nLeft}`} />
            <div className={`${styles.piece} ${styles.nDiagonal}`} />
            <div className={`${styles.piece} ${styles.nRight}`} />

            <div className={`${styles.piece} ${styles.eTop}`} />
            <div className={`${styles.piece} ${styles.eMiddle}`} />
            <div className={`${styles.piece} ${styles.eBottom}`} />

            <div className={`${styles.piece} ${styles.xDown}`} />
            <div className={`${styles.piece} ${styles.xUp}`} />

            <div className={styles.scan} />
          </div>
        </div>
      </div>
      <button
        className={styles.skip}
        id="intro-skip"
        type="button"
        onClick={skip}
        hidden={phase !== "playing"}
      >
        Saltar intro
      </button>
    </>
  );
}
