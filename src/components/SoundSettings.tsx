"use client";

import { useEffect, useState } from "react";
import {
  isBgmEnabled,
  isFxEnabled,
  play,
  setBgmEnabled,
  setFxEnabled,
} from "@/lib/sound";

export function SoundSettings() {
  const [fxOn, setFxOn] = useState(false);
  const [bgmOn, setBgmOn] = useState(false);

  // hydrate from localStorage on client
  useEffect(() => {
    setFxOn(isFxEnabled());
    setBgmOn(isBgmEnabled());
  }, []);

  const handleFx = (next: boolean) => {
    setFxEnabled(next);
    setFxOn(next);
    if (next) play("ok"); // demo the new state immediately
  };

  const handleBgm = (next: boolean) => {
    setBgmEnabled(next);
    setBgmOn(next);
  };

  return (
    <>
      <section style={s.section}>
        <p style={s.intro}>
          Authentic PS3 XMB sounds, gated behind opt-in toggles. Off by default
          so the site doesn&apos;t ambush anyone with audio.
        </p>
      </section>

      <section style={s.section}>
        <h3 style={s.h3}>Effects</h3>
        <Toggle
          label="Navigation tick and confirm sounds"
          note="Plays on arrow keys, Enter, and Esc. Recommended."
          checked={fxOn}
          onChange={handleFx}
        />
      </section>

      <section style={s.section}>
        <h3 style={s.h3}>Background</h3>
        <Toggle
          label="Ambient XMB loop (bgm)"
          note="The original PS3 menu ambient track, looping at low volume. Independent of FX."
          checked={bgmOn}
          onChange={handleBgm}
        />
      </section>

      <section style={s.section}>
        <p style={s.fineprint}>
          Sounds courtesy of the OSGameWare PS3 XMB sound pack. PS3 audio © Sony
          Computer Entertainment, used non-commercially. Preferences stored in
          your browser&apos;s localStorage.
        </p>
      </section>
    </>
  );
}

function Toggle({
  label,
  note,
  checked,
  onChange,
}: {
  label: string;
  note: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        ...s.toggleRow,
        borderColor: checked
          ? "rgba(116, 232, 157, 0.4)"
          : "rgba(255, 255, 255, 0.08)",
        background: checked
          ? "rgba(116, 232, 157, 0.05)"
          : "rgba(255, 255, 255, 0.02)",
      }}
    >
      <div style={s.toggleBody}>
        <div style={s.toggleLabel}>{label}</div>
        <div style={s.toggleNote}>{note}</div>
      </div>
      <div
        style={{
          ...s.switchTrack,
          background: checked
            ? "rgba(116, 232, 157, 0.5)"
            : "rgba(255, 255, 255, 0.18)",
        }}
      >
        <div
          style={{
            ...s.switchThumb,
            transform: checked ? "translateX(18px)" : "translateX(0)",
            background: checked ? "rgb(116, 232, 157)" : "rgba(255,255,255,0.85)",
          }}
        />
      </div>
    </button>
  );
}

const s: Record<string, React.CSSProperties> = {
  section: { marginBottom: 28 },
  h3: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    opacity: 0.55,
    margin: "0 0 14px",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: 600,
  },
  intro: {
    fontSize: 16,
    lineHeight: 1.55,
    margin: 0,
    opacity: 0.85,
    fontWeight: 300,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    maxWidth: 620,
  },
  fineprint: {
    fontSize: 12,
    lineHeight: 1.55,
    margin: 0,
    opacity: 0.5,
    fontWeight: 300,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    maxWidth: 620,
  },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    width: "100%",
    maxWidth: 620,
    padding: "14px 18px",
    border: "1px solid",
    borderRadius: 6,
    cursor: "pointer",
    color: "inherit",
    fontFamily: "inherit",
    transition: "background 0.15s, border-color 0.15s",
    textAlign: "left",
  },
  toggleBody: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  toggleLabel: {
    fontSize: 15,
    color: "white",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
  toggleNote: {
    fontSize: 12,
    opacity: 0.6,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
  switchTrack: {
    position: "relative",
    width: 40,
    height: 22,
    borderRadius: 999,
    transition: "background 0.15s",
    flexShrink: 0,
    padding: 2,
  },
  switchThumb: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    transition: "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.15s",
  },
};
