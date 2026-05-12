"use client";

import { useEffect } from "react";

/**
 * Hides the mouse cursor after a period of inactivity. The cursor reappears
 * on any mouse movement or key press. Mirrors the PS3 dashboard's behavior
 * of dimming idle UI to keep the wave the focal point.
 *
 * The cursor itself can't be transitioned smoothly (browsers ignore CSS
 * transitions on the `cursor` property), so this is a hard hide/show — but
 * the trailing inactivity timer prevents the cursor from flickering during
 * brief pauses.
 */
export function useIdleCursor(idleMs = 4500) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let hidden = false;

    const show = () => {
      if (hidden) {
        document.documentElement.classList.remove("cursorIdle");
        hidden = false;
      }
    };

    const scheduleHide = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        document.documentElement.classList.add("cursorIdle");
        hidden = true;
      }, idleMs);
    };

    const onMove = () => {
      show();
      scheduleHide();
    };

    const onKey = () => {
      show();
      scheduleHide();
    };

    // start with the show-then-schedule cycle so the cursor is visible on
    // mount but will fade if untouched
    scheduleHide();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("keydown", onKey);
    return () => {
      if (timer) clearTimeout(timer);
      document.documentElement.classList.remove("cursorIdle");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [idleMs]);
}
