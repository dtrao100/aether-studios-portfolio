"use client";

import { useMemo } from "react";
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
