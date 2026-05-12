/**
 * Wave shader variants for A/B comparison.
 *
 * Picked at runtime by WaveBackground via:
 *   1. ?wave=<id> query param (Rivet/preview convenience)
 *   2. localStorage("aether_wave_variant")
 *   3. default = "braided"
 *
 * To add another variant: append to VARIANTS and update WaveVariantId.
 */

export const VERTEX_SHADER = /* glsl */ `
  attribute vec2 aPos;
  void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

/* ============== braided (current) ===============
 * The shader the portfolio has been shipping with. Single braided ribbon
 * tendril with a bright head on the left, body band, sparkles. White on
 * theme-tinted background. */
const FRAGMENT_BRAIDED = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uTint;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float strand(vec2 uv, float t, float freq, float amp, float phase, float baseY, float slope) {
    float x = uv.x;
    float waveY = baseY
                + slope * (x - 0.5)
                + sin(x * freq * 0.7 + t * 0.8 + phase) * amp * 1.6
                + sin(x * freq + t + phase) * amp
                + sin(x * freq * 1.9 + t * 0.6 + phase) * amp * 0.35;
    return abs(uv.y - waveY);
  }

  float ribbon(float d, float core) {
    float coreI = pow(1.0 - clamp(d / core, 0.0, 1.0), 1.2);
    float halo  = pow(1.0 - clamp(d / (core * 5.0), 0.0, 1.0), 2.0) * 0.55;
    float soft  = pow(1.0 - clamp(d / (core * 9.0), 0.0, 1.0), 2.5) * 0.20;
    return coreI + halo + soft;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float t = uTime * 0.20;
    float anchorY = 0.38 + sin(uTime * 0.05) * 0.08;
    float slope = sin(uTime * 0.032) * 0.28;

    float d1 = strand(uv, t,        2.0, 0.075, 0.0,  anchorY,          slope);
    float d2 = strand(uv, t * 1.06, 2.3, 0.068, 1.3,  anchorY + 0.012,  slope);
    float d3 = strand(uv, t * 0.94, 1.8, 0.058, 2.7,  anchorY - 0.010,  slope);
    float d4 = strand(uv, t * 1.02, 2.5, 0.062, 4.2,  anchorY + 0.020,  slope);
    float d5 = strand(uv, t * 0.97, 1.7, 0.054, 5.6,  anchorY - 0.018,  slope);

    float r1 = ribbon(d1, 0.010);
    float r2 = ribbon(d2, 0.009);
    float r3 = ribbon(d3, 0.008);
    float r4 = ribbon(d4, 0.008);
    float r5 = ribbon(d5, 0.007);

    float meanY = anchorY
                + slope * (uv.x - 0.5)
                + sin(uv.x * 2.0 + t * 0.95) * 0.075 * 1.4
                + sin(uv.x * 1.5 + t * 0.7) * 0.040;
    float meanD = abs(uv.y - meanY);
    float bodyInner = pow(1.0 - clamp(meanD / 0.035, 0.0, 1.0), 1.6) * 0.85;
    float bodyOuter = pow(1.0 - clamp(meanD / 0.080, 0.0, 1.0), 2.4) * 0.35;
    float bodyFar   = pow(1.0 - clamp(meanD / 0.140, 0.0, 1.0), 3.0) * 0.12;
    float body = bodyInner + bodyOuter + bodyFar;

    float strandsMax = max(max(max(r1, r2), max(r3, r4)), r5);
    float strandsSum = (r1 + r2 + r3 + r4 + r5) * 0.04;
    float ribbonI = body + strandsMax * 0.28 + strandsSum;

    float xFalloff = mix(1.0, 0.35, smoothstep(0.0, 0.9, uv.x));

    float headSlope = slope * (0.08 - 0.5);
    vec2 headPos = vec2(0.08, anchorY + headSlope);
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    float headDist = distance(uv * aspect, headPos * aspect);
    float head = exp(-headDist * 28.0) * 0.55;
    head += exp(-headDist * 13.0) * 0.30;
    head += exp(-headDist * 6.0) * 0.14;

    vec2 sparkleUV = uv * vec2(220.0, 130.0);
    vec2 sparkleId = floor(sparkleUV);
    vec2 sparkleFrac = fract(sparkleUV) - 0.5;
    float sparkleSeed = hash21(sparkleId);
    float sparkleVis = step(0.988, sparkleSeed);
    float sparkleFlicker = 0.3 + 0.7 * sin(uTime * (0.35 + sparkleSeed * 1.4) + sparkleSeed * 6.28);
    float sparkleShape = exp(-dot(sparkleFrac, sparkleFrac) * 55.0);
    float sparkleField = sparkleVis * sparkleShape * max(0.0, sparkleFlicker);

    float coneMask = pow(1.0 - uv.x, 2.5);
    float headProx = exp(-headDist * 4.0);
    float sparkleWeight = (head * 1.8 + headProx * 1.5 + ribbonI * 0.25 + 0.04) * coneMask;
    float sparkles = sparkleField * sparkleWeight * 4.2;

    float intensity = ribbonI * xFalloff * 0.85 + head + sparkles;
    intensity = clamp(intensity, 0.0, 1.0);
    if (intensity <= 0.01) discard;

    vec3 col = mix(vec3(1.0), uTint, 0.12);
    gl_FragColor = vec4(col * intensity, intensity * 0.88);
  }
`;

/* ============== ribbon (drill-in mockup) ===============
 * The original fchavonet-style shader from drill-in-mockup.html.
 * 7 stacked sine ribbons with sharp edges. Ribbons take their tint
 * from uTint instead of the hardcoded 0.55 gray, so themes still apply. */
const FRAGMENT_RIBBON = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uTint;
  const float waveWidthFactor = 1.5;

  vec3 calcSine(vec2 uv, float speed, float frequency, float amplitude,
                float phaseShift, float verticalOffset, vec3 baseColor,
                float lineWidth, float sharpness, bool invertFalloff) {
    float angle = uTime * speed * frequency * -1.0 + (phaseShift + uv.x) * 2.0;
    float waveY = sin(angle) * amplitude + verticalOffset;
    float deltaY = waveY - uv.y;
    float d = distance(waveY, uv.y);
    if (invertFalloff) { if (deltaY > 0.0) d *= 4.0; }
    else { if (deltaY < 0.0) d *= 4.0; }
    float sm = smoothstep(lineWidth * waveWidthFactor, 0.0, d);
    float sc = pow(sm, sharpness);
    return min(baseColor * sc, baseColor);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec3 c = vec3(0.0);
    // Take wave color from theme tint, lightened toward white so ribbons
    // still read as bright over the colored background.
    vec3 base = mix(vec3(1.0), uTint, 0.35);
    c += calcSine(uv, 0.2, 0.20, 0.20, 0.0, 0.5, base, 0.10, 15.0, false);
    c += calcSine(uv, 0.4, 0.40, 0.15, 0.0, 0.5, base, 0.10, 17.0, false);
    c += calcSine(uv, 0.3, 0.60, 0.15, 0.0, 0.5, base, 0.05, 23.0, false);
    c += calcSine(uv, 0.1, 0.26, 0.07, 0.0, 0.3, base, 0.10, 17.0, true);
    c += calcSine(uv, 0.3, 0.36, 0.07, 0.0, 0.3, base, 0.10, 17.0, true);
    c += calcSine(uv, 0.5, 0.46, 0.07, 0.0, 0.3, base, 0.05, 23.0, true);
    c += calcSine(uv, 0.2, 0.58, 0.05, 0.0, 0.3, base, 0.20, 15.0, true);
    float m = max(max(c.r, c.g), c.b);
    if (m <= 0.0) discard;
    gl_FragColor = vec4(c, m * 0.7);
  }
`;

/* ============== ribbon-slow ===============
 * Same shape as ribbon but with slower animation and lower contrast for a
 * calmer feel. Some folks find the original ribbon too active. */
const FRAGMENT_RIBBON_SLOW = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uTint;
  const float waveWidthFactor = 1.5;

  vec3 calcSine(vec2 uv, float speed, float frequency, float amplitude,
                float phaseShift, float verticalOffset, vec3 baseColor,
                float lineWidth, float sharpness, bool invertFalloff) {
    float angle = uTime * speed * frequency * -1.0 + (phaseShift + uv.x) * 2.0;
    float waveY = sin(angle) * amplitude + verticalOffset;
    float deltaY = waveY - uv.y;
    float d = distance(waveY, uv.y);
    if (invertFalloff) { if (deltaY > 0.0) d *= 4.0; }
    else { if (deltaY < 0.0) d *= 4.0; }
    float sm = smoothstep(lineWidth * waveWidthFactor, 0.0, d);
    float sc = pow(sm, sharpness);
    return min(baseColor * sc, baseColor);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    // Slow the whole animation down to ~45% speed by scaling uTime via a
    // local time variable used in the speed multiplier.
    float SLOW = 0.45;
    vec3 c = vec3(0.0);
    vec3 base = mix(vec3(1.0), uTint, 0.35);
    c += calcSine(uv, 0.2 * SLOW, 0.20, 0.18, 0.0, 0.5, base, 0.12, 12.0, false);
    c += calcSine(uv, 0.4 * SLOW, 0.40, 0.14, 0.0, 0.5, base, 0.12, 14.0, false);
    c += calcSine(uv, 0.3 * SLOW, 0.60, 0.12, 0.0, 0.5, base, 0.07, 18.0, false);
    c += calcSine(uv, 0.1 * SLOW, 0.26, 0.07, 0.0, 0.3, base, 0.12, 14.0, true);
    c += calcSine(uv, 0.3 * SLOW, 0.36, 0.07, 0.0, 0.3, base, 0.12, 14.0, true);
    c += calcSine(uv, 0.2 * SLOW, 0.58, 0.05, 0.0, 0.3, base, 0.20, 12.0, true);
    float m = max(max(c.r, c.g), c.b);
    if (m <= 0.0) discard;
    gl_FragColor = vec4(c, m * 0.55);
  }
`;

export type WaveVariantId = "braided" | "ribbon" | "ribbon-slow";

export const VARIANTS: Record<WaveVariantId, { label: string; fragment: string; note: string }> = {
  braided: {
    label: "Braided",
    fragment: FRAGMENT_BRAIDED,
    note: "Current. Single braided tendril, bright head, body band, sparkles.",
  },
  ribbon: {
    label: "Ribbon",
    fragment: FRAGMENT_RIBBON,
    note: "Original 7-strand sharp sine ribbons (from drill-in-mockup.html).",
  },
  "ribbon-slow": {
    label: "Ribbon (slow)",
    fragment: FRAGMENT_RIBBON_SLOW,
    note: "Same shape as Ribbon but 45% speed and softer contrast.",
  },
};

export const DEFAULT_VARIANT: WaveVariantId = "ribbon-slow";
const STORAGE_KEY = "aether_wave_variant";

export function getActiveVariant(): WaveVariantId {
  if (typeof window === "undefined") return DEFAULT_VARIANT;
  // ?wave=X wins (Rivet/preview convenience)
  const fromURL = new URLSearchParams(window.location.search).get("wave");
  if (fromURL && fromURL in VARIANTS) return fromURL as WaveVariantId;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved && saved in VARIANTS) return saved as WaveVariantId;
  return DEFAULT_VARIANT;
}

export function setActiveVariant(id: WaveVariantId) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, id);
  window.dispatchEvent(new CustomEvent("aether-wave-variant-change", { detail: id }));
}
