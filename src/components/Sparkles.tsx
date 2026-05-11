"use client";

import { useMemo } from "react";
import styles from "./Sparkles.module.css";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Spark = {
  x: number; // 0..100
  y: number; // 0..100
  size: number; // px
  delay: number; // s
  duration: number; // s
  baseOpacity: number; // 0..1
};

const SEED_COUNT = 18;

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Sparkles() {
  const reduced = useReducedMotion();
  const sparks = useMemo<Spark[]>(() => {
    const rand = mulberry32(42);
    return Array.from({ length: SEED_COUNT }, () => ({
      x: rand() * 100,
      y: 12 + rand() * 76,
      size: 1.4 + rand() * 1.8,
      delay: rand() * 8,
      duration: 5 + rand() * 6,
      baseOpacity: 0.3 + rand() * 0.45,
    }));
  }, []);

  return (
    <div className={styles.layer} aria-hidden>
      {sparks.map((s, i) => (
        <span
          key={i}
          className={styles.spark}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: reduced ? "0s" : `${s.delay}s`,
            animationDuration: reduced ? "0s" : `${s.duration}s`,
            animationPlayState: reduced ? "paused" : "running",
            opacity: reduced ? s.baseOpacity * 0.7 : undefined,
          }}
        />
      ))}
    </div>
  );
}
