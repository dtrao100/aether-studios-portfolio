"use client";

import { useEffect } from "react";

/**
 * Manages two document-level CSS flags driven by user input:
 *
 *   html.cursorIdle  — cursor should be hidden. Set on keydown (keyboard
 *                      mode, mouse cursor is in the way) and after long
 *                      mouse inactivity. Cleared on mousemove.
 *
 *   html.hudUsed     — user has interacted with the UI. Set once any
 *                      keydown or mousedown happens and stays sticky for
 *                      the session. Used to fade the keyboard-hint pill
 *                      once it's redundant.
 *
 * CSS rules in XMB.module.css read these globals to fade the cursor +
 * hint bar appropriately. Together they make the interface more
 * immersive once the user demonstrates they know how to drive it.
 */
export function useIdleCursor(idleMs = 8000) {
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    const root = document.documentElement;
    const setCursorHidden = (hidden: boolean) => {
      root.classList.toggle("cursorIdle", hidden);
    };
    const markHudUsed = () => {
      root.classList.add("hudUsed");
    };

    const scheduleIdleHide = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setCursorHidden(true), idleMs);
    };

    const onMove = () => {
      setCursorHidden(false);
      scheduleIdleHide();
    };

    const onKey = () => {
      // Keyboard mode: cursor isn't being used to drive nav, hide it so
      // it doesn't visually compete with the active item.
      setCursorHidden(true);
      markHudUsed();
      if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = null;
      }
    };

    const onMouseDown = () => {
      markHudUsed();
    };

    // Initial state: cursor visible, hints visible, idle timer armed.
    setCursorHidden(false);
    scheduleIdleHide();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      root.classList.remove("cursorIdle");
      root.classList.remove("hudUsed");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [idleMs]);
}
