"use client";

import { useEffect, useState } from "react";
import { formatXMBClock } from "@/lib/time";
import styles from "./XMB.module.css";

type HUDProps = {
  hints?: React.ReactNode;
};

export function HUD({ hints }: HUDProps) {
  const [clock, setClock] = useState<string>(() => formatXMBClock());

  useEffect(() => {
    const tick = () => setClock(formatXMBClock());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className={styles.hudClock}>{clock}</div>
      <div className={styles.hudHints}>
        {hints ?? (
          <>
            <kbd>←</kbd>
            <kbd>→</kbd> Navigate · <kbd>↑</kbd>
            <kbd>↓</kbd> Select · <kbd>Enter</kbd> Open
          </>
        )}
      </div>
    </>
  );
}
