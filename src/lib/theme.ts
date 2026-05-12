"use client";

/**
 * Wave-tint theme system. Five PS3-faithful hues plus an "auto-drift" mode
 * that slowly cycles through them. Theme choice persists in localStorage.
 */

export type ThemeId = "drift" | "gray" | "blue" | "navy" | "indigo" | "warm";

export type ThemePalette = {
  id: ThemeId;
  label: string;
  note: string;
  /** RGB triplet (0..1) used as the wave's base tint in the fragment shader. */
  rgb: [number, number, number];
  /** Optional CSS swatch for the picker UI. */
  swatch: string;
};

const STORAGE_KEY = "aether_theme";

export const THEMES: Record<Exclude<ThemeId, "drift">, ThemePalette> = {
  gray:   { id: "gray",   label: "Original Gray",   note: "The XMB's neutral, pre-firmware-3 tone.",                rgb: [0.55, 0.55, 0.58], swatch: "linear-gradient(135deg, #6b6b6b, #2a2a2a)" },
  blue:   { id: "blue",   label: "Launch Blue",     note: "The PS3 launch theme. Deep, cinematic.",                 rgb: [0.30, 0.50, 0.80], swatch: "linear-gradient(135deg, #2b4cc8, #0d2270)" },
  indigo: { id: "indigo", label: "Indigo",          note: "Twilight register. Warmer at low brightness.",           rgb: [0.42, 0.32, 0.72], swatch: "linear-gradient(135deg, #6b48b9, #2d1e6a)" },
  navy:   { id: "navy",   label: "Deep Navy",       note: "Most muted of the colored themes.",                      rgb: [0.18, 0.30, 0.62], swatch: "linear-gradient(135deg, #2e4894, #0a1640)" },
  warm:   { id: "warm",   label: "Warm Gray",       note: "Slight ochre cast. Desk-lamp light at 11pm.",            rgb: [0.62, 0.55, 0.50], swatch: "linear-gradient(135deg, #9e8f7e, #3c3024)" },
};

export const DRIFT_THEME: ThemePalette = {
  id: "drift",
  label: "Auto drift",
  note: "Cycles through all five themes over 90 seconds. Default.",
  rgb: [0.55, 0.55, 0.58], // unused; drift computes per frame
  swatch:
    "conic-gradient(from 90deg, #2e4894, #6b48b9, #2b4cc8, #6b6b6b, #9e8f7e, #2e4894)",
};

export const DRIFT_SEQUENCE: ThemeId[] = ["navy", "indigo", "blue", "gray", "warm"];
export const DRIFT_CYCLE_SECONDS = 90;

const isClient = () => typeof window !== "undefined";

export function getActiveTheme(): ThemeId {
  if (!isClient()) return "drift";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "drift" || saved === "gray" || saved === "blue" || saved === "navy" || saved === "indigo" || saved === "warm") {
    return saved;
  }
  return "drift"; // default
}

export function setActiveTheme(id: ThemeId) {
  if (!isClient()) return;
  window.localStorage.setItem(STORAGE_KEY, id);
  window.dispatchEvent(new CustomEvent("aether-theme-change", { detail: id }));
}

/** Compute the current wave-tint RGB for a given theme and time-since-mount.
 *  For drift mode, smoothstep interpolation between DRIFT_SEQUENCE entries. */
export function computeTint(theme: ThemeId, timeSec: number): [number, number, number] {
  if (theme !== "drift") {
    return THEMES[theme].rgb;
  }
  const total = (timeSec / DRIFT_CYCLE_SECONDS) % 1;
  const segs = DRIFT_SEQUENCE.length;
  const segLen = 1 / segs;
  const segIdx = Math.floor(total / segLen);
  const segT = (total - segIdx * segLen) / segLen;
  const smooth = segT * segT * (3 - 2 * segT); // smoothstep
  const a = THEMES[DRIFT_SEQUENCE[segIdx] as Exclude<ThemeId, "drift">].rgb;
  const b = THEMES[DRIFT_SEQUENCE[(segIdx + 1) % segs] as Exclude<ThemeId, "drift">].rgb;
  return [
    a[0] + (b[0] - a[0]) * smooth,
    a[1] + (b[1] - a[1]) * smooth,
    a[2] + (b[2] - a[2]) * smooth,
  ];
}
