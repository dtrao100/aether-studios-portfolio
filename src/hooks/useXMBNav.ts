"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CursorState, XMBMode } from "@/types";
import { CATEGORIES, DEFAULT_CATEGORY_INDEX } from "@/content/categories";

type Direction = "up" | "down" | "left" | "right";

/**
 * Ramping-scroll constants (ms per advance).
 * First press is immediate. Then after `HOLD_DELAY`, we begin auto-advancing
 * at `SLOW_INTERVAL`. After `RAMP_AFTER` ticks the interval shrinks to `FAST_INTERVAL`.
 */
const HOLD_DELAY = 320;
const SLOW_INTERVAL = 180;
const FAST_INTERVAL = 90;
const RAMP_AFTER = 4;

const KEY_TO_DIRECTION: Record<string, Direction | undefined> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
  a: "left",
  A: "left",
  d: "right",
  D: "right",
  w: "up",
  W: "up",
  s: "down",
  S: "down",
};

export type UseXMBNavOptions = {
  initialCursor?: CursorState;
  mode?: XMBMode;
};

export function useXMBNav(opts: UseXMBNavOptions = {}) {
  const router = useRouter();

  const [cursor, setCursor] = useState<CursorState>(
    opts.initialCursor ?? { categoryIndex: DEFAULT_CATEGORY_INDEX, itemIndex: 0 }
  );
  const [mode] = useState<XMBMode>(opts.mode ?? "xmb");

  // refs we can read inside event handlers without re-binding
  const cursorRef = useRef(cursor);
  useEffect(() => {
    cursorRef.current = cursor;
  }, [cursor]);

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeKeyRef = useRef<string | null>(null);
  const tickCountRef = useRef(0);

  const stepCursor = useCallback((dir: Direction) => {
    setCursor((prev) => {
      const cat = CATEGORIES[prev.categoryIndex];
      if (!cat) return prev;
      if (dir === "left") {
        if (prev.categoryIndex <= 0) return prev;
        return { categoryIndex: prev.categoryIndex - 1, itemIndex: 0 };
      }
      if (dir === "right") {
        if (prev.categoryIndex >= CATEGORIES.length - 1) return prev;
        return { categoryIndex: prev.categoryIndex + 1, itemIndex: 0 };
      }
      if (dir === "up") {
        if (prev.itemIndex <= 0) return prev;
        return { ...prev, itemIndex: prev.itemIndex - 1 };
      }
      if (dir === "down") {
        if (prev.itemIndex >= cat.items.length - 1) return prev;
        return { ...prev, itemIndex: prev.itemIndex + 1 };
      }
      return prev;
    });
  }, []);

  const stopHold = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (repeatIntervalRef.current) {
      clearInterval(repeatIntervalRef.current);
      repeatIntervalRef.current = null;
    }
    activeKeyRef.current = null;
    tickCountRef.current = 0;
  }, []);

  const enter = useCallback(() => {
    const c = cursorRef.current;
    const cat = CATEGORIES[c.categoryIndex];
    const item = cat?.items[c.itemIndex];
    if (item?.href && item.status !== "disabled") {
      router.push(item.href);
    }
  }, [router]);

  useEffect(() => {
    if (mode !== "xmb") return;

    const onKeyDown = (e: KeyboardEvent) => {
      // ignore OS key-repeat — we manage repeat ourselves
      if (e.repeat) {
        e.preventDefault();
        return;
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        enter();
        return;
      }

      const dir = KEY_TO_DIRECTION[e.key];
      if (!dir) return;

      e.preventDefault();

      // first press: navigate immediately
      stopHold();
      activeKeyRef.current = e.key;
      stepCursor(dir);

      // schedule the ramp: after HOLD_DELAY, start auto-advancing
      // (we don't stop at boundary — cursor naturally clamps; interval ends on keyup)
      holdTimerRef.current = setTimeout(() => {
        repeatIntervalRef.current = setInterval(() => {
          tickCountRef.current += 1;
          stepCursor(dir);
          // ramp to faster interval after RAMP_AFTER slow ticks
          if (tickCountRef.current === RAMP_AFTER && repeatIntervalRef.current) {
            clearInterval(repeatIntervalRef.current);
            repeatIntervalRef.current = setInterval(() => {
              stepCursor(dir);
            }, FAST_INTERVAL);
          }
        }, SLOW_INTERVAL);
      }, HOLD_DELAY);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === activeKeyRef.current) {
        stopHold();
      }
    };

    const onBlur = () => stopHold();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      stopHold();
    };
  }, [mode, enter, stepCursor, stopHold]);

  const setCursorTo = useCallback((next: CursorState) => {
    setCursor(next);
  }, []);

  return {
    cursor,
    enter,
    setCursor: setCursorTo,
    categories: CATEGORIES,
  };
}
