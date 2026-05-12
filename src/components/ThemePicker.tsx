"use client";

import { useEffect, useState } from "react";
import {
  DRIFT_THEME,
  THEMES,
  getActiveTheme,
  setActiveTheme,
  type ThemeId,
} from "@/lib/theme";

export function ThemePicker() {
  const [active, setActive] = useState<ThemeId>("drift");

  useEffect(() => {
    setActive(getActiveTheme());
  }, []);

  const pick = (id: ThemeId) => {
    setActiveTheme(id);
    setActive(id);
  };

  const ALL = [DRIFT_THEME, THEMES.gray, THEMES.blue, THEMES.indigo, THEMES.navy, THEMES.warm];

  return (
    <>
      <section style={s.section}>
        <p style={s.intro}>
          Click a theme to apply it instantly. The wave tint changes in real
          time. Auto drift cycles through the five colors over 90 seconds and
          is the default.
        </p>
      </section>

      <section style={s.section}>
        <ul style={s.list}>
          {ALL.map((t) => {
            const isActive = active === t.id;
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => pick(t.id)}
                  style={{
                    ...s.row,
                    borderColor: isActive
                      ? "rgba(116, 232, 157, 0.45)"
                      : "rgba(255, 255, 255, 0.08)",
                    background: isActive
                      ? "rgba(116, 232, 157, 0.05)"
                      : "rgba(255, 255, 255, 0.02)",
                  }}
                >
                  <span style={{ ...s.swatch, background: t.swatch }} />
                  <div style={s.body}>
                    <div style={s.label}>
                      {t.label}
                      {isActive && <span style={s.activeChip}>Active</span>}
                    </div>
                    <div style={s.note}>{t.note}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section style={s.section}>
        <p style={s.fineprint}>
          Theme persists in your browser. Wave tints are inspired by the
          five PS3 dashboard themes; "Auto drift" is the nearest cousin to
          the PS3 dynamic theme that cycled with time of day.
        </p>
      </section>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  section: { marginBottom: 24 },
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
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    width: "100%",
    maxWidth: 620,
    padding: "12px 16px",
    border: "1px solid",
    borderRadius: 6,
    cursor: "pointer",
    color: "inherit",
    fontFamily: "inherit",
    textAlign: "left",
    transition: "background 0.15s ease, border-color 0.15s ease",
  },
  swatch: {
    width: 56,
    height: 36,
    borderRadius: 4,
    flexShrink: 0,
    border: "1px solid rgba(255,255,255,0.1)",
  },
  body: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  label: {
    fontSize: 15,
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
  note: {
    fontSize: 12,
    opacity: 0.65,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
  activeChip: {
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    padding: "2px 7px",
    borderRadius: 3,
    background: "rgba(116, 232, 157, 0.18)",
    color: "rgb(116, 232, 157)",
    border: "1px solid rgba(116, 232, 157, 0.4)",
  },
};
