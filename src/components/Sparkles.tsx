"use client";

import { useMemo } from "react";
import styles from "./Sparkles.module.css";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Spark = {
  startX: number; // %
  driftX: number; // px to drift right over lifetime
  y: number; // %
  size: number; // px
  delay: number; // s
  duration: number; // s
  peakOpacity: number; // 0..1
};

// 60 particles clustered around the wave's central band, biased toward the left
// (where the PS3 wave is brightest), drifting right over their lifecycle.
const COUNT = 60;

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
      // x: bias toward left — quadratic so more dense at left edge
      const u = rand();
      const xBias = u * u; // 0..1 with quadratic bias toward 0
      const startX = xBias * 70; // 0 to 70% of viewport
      // y: cluster around middle band (where wave is) — 35% to 75% with extra density mid
      const v = rand();
      const yBias = 0.5 + (v - 0.5) * 0.7; // softer around 0.5
      const y = 28 + yBias * 50; // 28-78%
      // particles drift right by 120-260px over their life
      const driftX = 120 + rand() * 140;
      // duration 5-10s
      const duration = 5 + rand() * 5;
      // staggered delays so the field is continuously populated
      const delay = -rand() * duration; // negative so they start mid-animation
      // sizes: most are tiny, a few brighter
      const sizeRoll = rand();
      const size = sizeRoll < 0.7 ? 1.4 + rand() * 0.9 : 2.4 + rand() * 1.6;
      const peakOpacity = 0.35 + rand() * 0.5;
      return { startX, driftX, y, size, delay, duration, peakOpacity };
    });
  }, []);

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
            // pass drift distance and peak opacity through CSS variables
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
