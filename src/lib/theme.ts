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
  /** Background gradient center color (hex). Tints the page beneath the wave. */
  bgCenter: string;
  /** Background gradient edge color (hex). Vignette darker than center. */
  bgEdge: string;
  /** CSS swatch for the picker UI. */
  swatch: string;
};

const STORAGE_KEY = "aether_theme";

/**
 * Background palette derived from pixel-sampling the actual PS3 dashboard
 * reference video. The bg has a TOP→BOTTOM dark-to-bright gradient (not
 * center-out radial), plus slight left-side brightness boost from the
 * wave's head glow.
 *
 *   bgEdge   = top color (darkest)
 *   bgCenter = bottom color (brightest)
 *
 * Measured navy values (from frame_006.5s):
 *   top    #000D5C  rgb(0,13,92)
 *   mid    #00146E  rgb(0,20,110)
 *   bottom #2B4AAB  rgb(43,74,171)
 *
 * Other themes derived by hue-shifting these reference points.
 */
export const THEMES: Record<Exclude<ThemeId, "drift">, ThemePalette> = {
  gray:   {
    id: "gray", label: "Original Gray",
    note: "The XMB's neutral, pre-firmware-3 tone.",
    rgb: [0.55, 0.55, 0.58],
    bgEdge: "#1c1c20", bgCenter: "#4a4a52",
    swatch: "linear-gradient(135deg, #6b6b6b, #2a2a2a)",
  },
  blue: {
    id: "blue", label: "Launch Blue",
    note: "The PS3 launch theme. Deep, cinematic.",
    rgb: [0.30, 0.50, 0.80],
    bgEdge: "#001870", bgCenter: "#3258BB",
    swatch: "linear-gradient(135deg, #2b4cc8, #0d2270)",
  },
  indigo: {
    id: "indigo", label: "Indigo",
    note: "Twilight register. Warmer at low brightness.",
    rgb: [0.42, 0.32, 0.72],
    bgEdge: "#1c0860", bgCenter: "#5638B0",
    swatch: "linear-gradient(135deg, #6b48b9, #2d1e6a)",
  },
  navy: {
    id: "navy", label: "Deep Navy",
    note: "The reference frame's hue. Classic PS3.",
    rgb: [0.18, 0.30, 0.62],
    bgEdge: "#000D5C", bgCenter: "#2B4AAB",
    swatch: "linear-gradient(135deg, #2e4894, #0a1640)",
  },
  warm: {
    id: "warm", label: "Warm Gray",
    note: "Slight ochre cast. Desk-lamp light at 11pm.",
    rgb: [0.62, 0.55, 0.50],
    bgEdge: "#1c150c", bgCenter: "#52402e",
    swatch: "linear-gradient(135deg, #9e8f7e, #3c3024)",
  },
};

export const DRIFT_THEME: ThemePalette = {
  id: "drift",
  label: "Auto drift",
  note: "Cycles through all five themes over 90 seconds. Default.",
  rgb: [0.55, 0.55, 0.58], // unused; drift computes per frame
  bgCenter: "#1c1c28", bgEdge: "#0a0a14", // approximate midpoint
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

function lerpHex(a: string, b: string, t: number): string {
  const aN = parseInt(a.slice(1), 16);
  const bN = parseInt(b.slice(1), 16);
  const ar = (aN >> 16) & 0xff;
  const ag = (aN >> 8) & 0xff;
  const ab = aN & 0xff;
  const br = (bN >> 16) & 0xff;
  const bg = (bN >> 8) & 0xff;
  const bb = bN & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${[r, g, bl].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

/** Background gradient colors for the body. For drift, interpolates between
 *  the sequence's bg colors using the same smoothstep curve as the wave. */
export function computeBg(theme: ThemeId, timeSec: number): { center: string; edge: string } {
  if (theme !== "drift") {
    return { center: THEMES[theme].bgCenter, edge: THEMES[theme].bgEdge };
  }
  const total = (timeSec / DRIFT_CYCLE_SECONDS) % 1;
  const segs = DRIFT_SEQUENCE.length;
  const segLen = 1 / segs;
  const segIdx = Math.floor(total / segLen);
  const segT = (total - segIdx * segLen) / segLen;
  const smooth = segT * segT * (3 - 2 * segT);
  const a = THEMES[DRIFT_SEQUENCE[segIdx] as Exclude<ThemeId, "drift">];
  const b = THEMES[DRIFT_SEQUENCE[(segIdx + 1) % segs] as Exclude<ThemeId, "drift">];
  return {
    center: lerpHex(a.bgCenter, b.bgCenter, smooth),
    edge: lerpHex(a.bgEdge, b.bgEdge, smooth),
  };
}

/** Apply theme bg colors to CSS custom properties on the document root.
 *  globals.css uses these custom properties in the body's radial gradient. */
export function applyBgCss(center: string, edge: string) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty("--bg-center", center);
  document.documentElement.style.setProperty("--bg-edge", edge);
}
