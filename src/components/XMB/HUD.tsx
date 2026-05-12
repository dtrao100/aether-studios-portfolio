"use client";

import { useEffect, useState } from "react";
import { formatXMBClock } from "@/lib/time";
import { isBgmEnabled, setBgmEnabled } from "@/lib/sound";
import styles from "./XMB.module.css";

type HUDProps = {
  hints?: React.ReactNode;
};

export function HUD({ hints }: HUDProps) {
  const [clock, setClock] = useState<string>(() => formatXMBClock());
  const [bgmOn, setBgmOn] = useState(false);

  useEffect(() => {
    const tick = () => setClock(formatXMBClock());
    tick();
    const id = setInterval(tick, 30_000);
    setBgmOn(isBgmEnabled());
    return () => clearInterval(id);
  }, []);

  const toggleBgm = () => {
    const next = !bgmOn;
    setBgmEnabled(next);
    setBgmOn(next);
  };

  return (
    <>
      <div className={styles.hudTopRight}>
        <button
          type="button"
          className={styles.hudMuteButton}
          onClick={toggleBgm}
          aria-label={bgmOn ? "Mute ambient music" : "Play ambient music"}
          title={bgmOn ? "Mute ambient music" : "Play ambient music"}
          data-active={bgmOn ? "true" : "false"}
        >
          {bgmOn ? <SpeakerIcon /> : <SpeakerMutedIcon />}
        </button>
        <div className={styles.hudClock}>{clock}</div>
      </div>
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

function SpeakerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 010 7.07" />
      <path d="M19.07 4.93a10 10 0 010 14.14" />
    </svg>
  );
}

function SpeakerMutedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  );
}
