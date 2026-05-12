"use client";

import { useEffect, useMemo } from "react";
import styles from "./Sparkles.module.css";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Spark = {
  startX: number;
  driftX: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  peakOpacity: number;
};

const COUNT = 60;
const GLOW_DIAMETER = 180;
const GLOW_ID = "aether-cursor-glow";
/** Hide the glow if the user hasn't moved the mouse in this many ms — the glow
 *  is for mouse exploration, not keyboard navigation. */
const GLOW_IDLE_FADE_MS = 400;

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Sparkles() {
  const reduced = useReducedMotion();

  const sparks = useMemo<Spark[]>(() => {
    const rand = mulberry32(2026);
    return Array.from({ length: COUNT }, () => {
      const u = rand();
      const xBias = u * u;
      const startX = xBias * 70;
      const v = rand();
      const yBias = 0.5 + (v - 0.5) * 0.7;
      const y = 28 + yBias * 50;
      const driftX = 120 + rand() * 140;
      const duration = 5 + rand() * 5;
      const delay = -rand() * duration;
      const sizeRoll = rand();
      const size = sizeRoll < 0.7 ? 1.4 + rand() * 0.9 : 2.4 + rand() * 1.6;
      const peakOpacity = 0.35 + rand() * 0.5;
      return { startX, driftX, y, size, delay, duration, peakOpacity };
    });
  }, []);

  // cursor-proximity glow — DOM-only, appended directly to body to avoid
  // React reconciliation overwriting inline-style updates each render.
  useEffect(() => {
    if (reduced) return;

    // create the glow element and append directly to body — avoids React
    // reconciliation issues with inline-style updates
    const glow = document.createElement("div");
    glow.id = GLOW_ID;
    glow.setAttribute("aria-hidden", "true");
    Object.assign(glow.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: `${GLOW_DIAMETER}px`,
      height: `${GLOW_DIAMETER}px`,
      marginLeft: `-${GLOW_DIAMETER / 2}px`,
      marginTop: `-${GLOW_DIAMETER / 2}px`,
      pointerEvents: "none",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.14) 30%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0) 78%)",
      mixBlendMode: "screen",
      transform: "translate3d(-1000px, -1000px, 0)",
      opacity: "0",
      transition: "opacity 280ms ease",
      willChange: "transform, opacity",
      zIndex: "0",
    });
    document.body.appendChild(glow);

    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const handle = (e: MouseEvent) => {
      glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      glow.style.opacity = "1";
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        glow.style.opacity = "0";
      }, GLOW_IDLE_FADE_MS * 6); // fade after extended mouse idle
    };

    const leave = () => {
      glow.style.opacity = "0";
    };

    // hide the glow as soon as the user starts navigating with keys — the glow
    // is for mouse exploration, not keyboard
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (
        k === "ArrowLeft" || k === "ArrowRight" || k === "ArrowUp" || k === "ArrowDown" ||
        k === "Enter" || k === " " || k === "Escape" ||
        k === "w" || k === "W" || k === "a" || k === "A" ||
        k === "s" || k === "S" || k === "d" || k === "D"
      ) {
        glow.style.opacity = "0";
      }
    };

    window.addEventListener("mousemove", handle);
    document.addEventListener("mouseleave", leave);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousemove", handle);
      document.removeEventListener("mouseleave", leave);
      window.removeEventListener("keydown", onKey);
      if (idleTimer) clearTimeout(idleTimer);
      glow.remove();
    };
  }, [reduced]);

  return (
    <div className={styles.layer} aria-hidden>
      {sparks.map((s, i) => (
        <span
          key={i}
          className={styles.spark}
          style={{
            left: `${s.startX}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            ["--drift-x" as string]: `${s.driftX}px`,
            ["--peak-opacity" as string]: s.peakOpacity,
            animationDelay: reduced ? "0s" : `${s.delay}s`,
            animationDuration: reduced ? "0s" : `${s.duration}s`,
            animationPlayState: reduced ? "paused" : "running",
            opacity: reduced ? s.peakOpacity * 0.5 : undefined,
          }}
        />
      ))}
    </div>
  );
}
