"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CursorState, XMBMode } from "@/types";
import { CATEGORIES, DEFAULT_CATEGORY_INDEX } from "@/content/categories";

type Direction = "up" | "down" | "left" | "right";

const TRANSITION_GUARD_MS = 220;

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
  const transitioningRef = useRef<{ h: boolean; v: boolean }>({ h: false, v: false });

  const guard = useCallback((axis: "h" | "v") => {
    if (transitioningRef.current[axis]) return false;
    transitioningRef.current[axis] = true;
    setTimeout(() => {
      transitioningRef.current[axis] = false;
    }, TRANSITION_GUARD_MS);
    return true;
  }, []);

  const navigate = useCallback(
    (dir: Direction) => {
      setCursor((prev) => {
        const cat = CATEGORIES[prev.categoryIndex];
        if (!cat) return prev;
        if (dir === "left") {
          if (!guard("h")) return prev;
          if (prev.categoryIndex <= 0) return prev;
          return { categoryIndex: prev.categoryIndex - 1, itemIndex: 0 };
        }
        if (dir === "right") {
          if (!guard("h")) return prev;
          if (prev.categoryIndex >= CATEGORIES.length - 1) return prev;
          return { categoryIndex: prev.categoryIndex + 1, itemIndex: 0 };
        }
        if (dir === "up") {
          if (!guard("v")) return prev;
          if (prev.itemIndex <= 0) return prev;
          return { ...prev, itemIndex: prev.itemIndex - 1 };
        }
        if (dir === "down") {
          if (!guard("v")) return prev;
          if (prev.itemIndex >= cat.items.length - 1) return prev;
          return { ...prev, itemIndex: prev.itemIndex + 1 };
        }
        return prev;
      });
    },
    [guard]
  );

  const enter = useCallback(() => {
    const cat = CATEGORIES[cursor.categoryIndex];
    const item = cat?.items[cursor.itemIndex];
    if (item?.href && item.status !== "disabled") {
      router.push(item.href);
    }
  }, [cursor, router]);

  useEffect(() => {
    if (mode !== "xmb") return;
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          navigate("left");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          navigate("right");
          break;
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          navigate("up");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          navigate("down");
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          enter();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, enter, mode]);

  const setCursorTo = useCallback((next: CursorState) => {
    setCursor(next);
  }, []);

  return {
    cursor,
    navigate,
    enter,
    setCursor: setCursorTo,
    categories: CATEGORIES,
  };
}
