"use client";

import { useEffect, useState } from "react";
import { VARIANTS, getActiveVariant, setActiveVariant, type WaveVariantId } from "@/lib/shader-variants";

/**
 * Floating wave-variant picker. Lives in the bottom-left corner with a
 * compact "Wave: …" button that expands into a row of variant buttons on
 * hover/click. Used to A/B between shader variants during design review.
 *
 * Showing only when ?wave-picker=1 is in the URL OR localStorage flag is
 * set, so it doesn't appear in production unless explicitly enabled.
 */
export function WaveVariantPicker() {
  const [active, setActive] = useState<WaveVariantId>("braided");
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setActive(getActiveVariant());
    const params = new URLSearchParams(window.location.search);
    const flag = params.get("wave-picker") === "1"
      || window.localStorage.getItem("aether_wave_picker") === "1";
    if (params.get("wave-picker") === "1") {
      window.localStorage.setItem("aether_wave_picker", "1");
    }
    setEnabled(flag);
  }, []);

  if (!enabled) return null;

  const choose = (id: WaveVariantId) => {
    setActiveVariant(id);
    setActive(id);
  };

  const variantIds = Object.keys(VARIANTS) as WaveVariantId[];

  return (
    <div style={s.shell} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        style={s.toggle}
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        Wave: {VARIANTS[active].label}
      </button>
      {open && (
        <div style={s.menu}>
          {variantIds.map((id) => (
            <button
              key={id}
              type="button"
              style={{
                ...s.option,
                ...(id === active ? s.optionActive : {}),
              }}
              onClick={() => choose(id)}
              title={VARIANTS[id].note}
            >
              <span style={s.optionLabel}>{VARIANTS[id].label}</span>
              <span style={s.optionNote}>{VARIANTS[id].note}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  shell: {
    position: "fixed",
    bottom: 20,
    left: 20,
    zIndex: 1000,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    color: "white",
  },
  toggle: {
    background: "rgba(10, 14, 28, 0.7)",
    border: "1px solid rgba(255,255,255,0.18)",
    backdropFilter: "blur(10px)",
    color: "rgba(255,255,255,0.85)",
    padding: "8px 14px",
    borderRadius: 999,
    cursor: "pointer",
    fontSize: 12,
    letterSpacing: 0.4,
  },
  menu: {
    marginTop: 8,
    background: "rgba(10, 14, 28, 0.85)",
    border: "1px solid rgba(255,255,255,0.18)",
    backdropFilter: "blur(12px)",
    padding: 6,
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    width: 320,
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  option: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    background: "transparent",
    border: "1px solid transparent",
    padding: "8px 10px",
    borderRadius: 6,
    cursor: "pointer",
    color: "rgba(255,255,255,0.85)",
    textAlign: "left",
    gap: 2,
  },
  optionActive: {
    background: "rgba(255,255,255,0.10)",
    borderColor: "rgba(255,255,255,0.25)",
  },
  optionLabel: { fontSize: 13, fontWeight: 500, color: "white" },
  optionNote: { fontSize: 11, opacity: 0.65, lineHeight: 1.4 },
};
