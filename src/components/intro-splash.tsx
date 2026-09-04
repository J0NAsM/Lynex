"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./intro-splash.module.css";

type IntroPhase = "playing" | "leaving" | "finished";

export function IntroSplash() {
  const [phase, setPhase] = useState<IntroPhase>("playing");
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fadeDelay = reducedMotion ? 80 : 3150;
    const fadeDuration = reducedMotion ? 20 : 900;

    const fadeTimer = window.setTimeout(() => setPhase("leaving"), fadeDelay);
    const finishTimer = window.setTimeout(() => {
      releaseScroll();
      setPhase("finished");
    }, fadeDelay + fadeDuration);

    return () => {
      window.removeEventListener("resize", fitLogo);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(finishTimer);
      releaseScroll();
    };
  }, []);

  if (phase === "finished") return null;

  return (
    <div
      className={`${styles.splash}${phase === "leaving" ? ` ${styles.leaving}` : ""}`}
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
  );
}
