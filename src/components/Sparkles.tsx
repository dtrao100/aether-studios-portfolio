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
const GLOW_DIAMETER = 280;
const GLOW_ID = "aether-cursor-glow";

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
        "radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.07) 28%, rgba(255,255,255,0.02) 55%, rgba(255,255,255,0) 75%)",
      mixBlendMode: "screen",
      transform: "translate3d(-1000px, -1000px, 0)",
      opacity: "0",
      transition: "opacity 350ms ease",
      willChange: "transform, opacity",
      zIndex: "0",
    });
    document.body.appendChild(glow);

    // direct mousemove → style update (mousemove is OS-throttled to ~60Hz,
    // and two style writes per move is well below any perf budget)
    const handle = (e: MouseEvent) => {
      glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      glow.style.opacity = "1";
    };

    const leave = () => {
      glow.style.opacity = "0";
    };

    window.addEventListener("mousemove", handle);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", handle);
      document.removeEventListener("mouseleave", leave);
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
