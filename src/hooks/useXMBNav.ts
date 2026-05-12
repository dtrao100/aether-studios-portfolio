"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CursorState, XMBMode } from "@/types";
import { CATEGORIES, DEFAULT_CATEGORY_INDEX } from "@/content/categories";

type Direction = "up" | "down" | "left" | "right";

const HOLD_DELAY = 320;
const SLOW_INTERVAL = 180;
const FAST_INTERVAL = 90;
const RAMP_AFTER = 4;

// overscroll phase timing (horizontal only — vertical stops at "pull")
const CHARGE_AFTER_MS = 320;
// Charge transition runs 1.3s. Add a 250ms "settled at thin" buffer before
// the armed tremble kicks in so the charge gradient and tremble don't start
// in the same frame (which reads as a snap).
const ARMED_AFTER_MS = 320 + 1300 + 250; // 1870ms from press
const SLINGSHOT_DURATION_MS = 2400;

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

export type OverscrollPhase = "pull" | "charge" | "armed" | "slingshot";
export type OverscrollState = {
  axis: "h" | "v";
  dir: 1 | -1;
  phase: OverscrollPhase;
} | null;

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

  const cursorRef = useRef(cursor);
  useEffect(() => {
    cursorRef.current = cursor;
  }, [cursor]);

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chargeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const armedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slingshotTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeKeyRef = useRef<string | null>(null);
  const tickCountRef = useRef(0);

  const [overscroll, setOverscroll] = useState<OverscrollState>(null);
  const overscrollRef = useRef<OverscrollState>(null);
  useEffect(() => {
    overscrollRef.current = overscroll;
  }, [overscroll]);

  const clearPhaseTimers = useCallback(() => {
    if (chargeTimerRef.current) {
      clearTimeout(chargeTimerRef.current);
      chargeTimerRef.current = null;
    }
    if (armedTimerRef.current) {
      clearTimeout(armedTimerRef.current);
      armedTimerRef.current = null;
    }
  }, []);

  const beginOverscroll = useCallback(
    (axis: "h" | "v", dir: 1 | -1) => {
      clearPhaseTimers();
      // start at pull phase immediately
      setOverscroll({ axis, dir, phase: "pull" });
      // horizontal escalates through charge → armed; vertical stays at pull
      if (axis === "h") {
        chargeTimerRef.current = setTimeout(() => {
          setOverscroll({ axis, dir, phase: "charge" });
        }, CHARGE_AFTER_MS);
        armedTimerRef.current = setTimeout(() => {
          setOverscroll({ axis, dir, phase: "armed" });
        }, ARMED_AFTER_MS);
      }
    },
    [clearPhaseTimers]
  );

  const stepCursor = useCallback(
    (dir: Direction) => {
      // ignore any cursor moves while a slingshot is in flight
      if (overscrollRef.current?.phase === "slingshot") return;

      const current = cursorRef.current;
      const cat = CATEGORIES[current.categoryIndex];
      if (!cat) return;

      if (dir === "left") {
        if (current.categoryIndex <= 0) {
          if (overscrollRef.current?.axis !== "h" || overscrollRef.current?.dir !== -1) {
            beginOverscroll("h", -1);
          }
          return;
        }
        setOverscroll(null);
        clearPhaseTimers();
        setCursor({ categoryIndex: current.categoryIndex - 1, itemIndex: 0 });
      } else if (dir === "right") {
        if (current.categoryIndex >= CATEGORIES.length - 1) {
          if (overscrollRef.current?.axis !== "h" || overscrollRef.current?.dir !== 1) {
            beginOverscroll("h", 1);
          }
          return;
        }
        setOverscroll(null);
        clearPhaseTimers();
        setCursor({ categoryIndex: current.categoryIndex + 1, itemIndex: 0 });
      } else if (dir === "up") {
        if (current.itemIndex <= 0) {
          if (overscrollRef.current?.axis !== "v" || overscrollRef.current?.dir !== -1) {
            beginOverscroll("v", -1);
          }
          return;
        }
        setOverscroll(null);
        setCursor({ ...current, itemIndex: current.itemIndex - 1 });
      } else if (dir === "down") {
        if (current.itemIndex >= cat.items.length - 1) {
          if (overscrollRef.current?.axis !== "v" || overscrollRef.current?.dir !== 1) {
            beginOverscroll("v", 1);
          }
          return;
        }
        setOverscroll(null);
        setCursor({ ...current, itemIndex: current.itemIndex + 1 });
      }
    },
    [beginOverscroll, clearPhaseTimers]
  );

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

  const releaseOverscroll = useCallback(() => {
    const current = overscrollRef.current;
    if (!current) return;
    clearPhaseTimers();

    // armed release on horizontal → fire slingshot wraparound
    if (current.axis === "h" && current.phase === "armed") {
      const oppositeIndex = current.dir === 1 ? 0 : CATEGORIES.length - 1;
      // update cursor to the opposite end; the spring transition handles the inertia overshoot
      setCursor({ categoryIndex: oppositeIndex, itemIndex: 0 });
      setOverscroll({ axis: "h", dir: current.dir, phase: "slingshot" });
      if (slingshotTimerRef.current) clearTimeout(slingshotTimerRef.current);
      slingshotTimerRef.current = setTimeout(() => {
        setOverscroll(null);
        slingshotTimerRef.current = null;
      }, SLINGSHOT_DURATION_MS);
      return;
    }

    setOverscroll(null);
  }, [clearPhaseTimers]);

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

      stopHold();
      activeKeyRef.current = e.key;
      stepCursor(dir);

      holdTimerRef.current = setTimeout(() => {
        repeatIntervalRef.current = setInterval(() => {
          tickCountRef.current += 1;
          stepCursor(dir);
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
        releaseOverscroll();
      }
    };

    const onBlur = () => {
      stopHold();
      releaseOverscroll();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      stopHold();
      clearPhaseTimers();
      if (slingshotTimerRef.current) clearTimeout(slingshotTimerRef.current);
    };
  }, [mode, enter, stepCursor, stopHold, releaseOverscroll, clearPhaseTimers]);

  const setCursorTo = useCallback((next: CursorState) => {
    setCursor(next);
    setOverscroll(null);
    clearPhaseTimers();
  }, [clearPhaseTimers]);

  return {
    cursor,
    overscroll,
    enter,
    setCursor: setCursorTo,
    categories: CATEGORIES,
  };
}
