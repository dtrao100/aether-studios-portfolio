export const VERTEX_SHADER = /* glsl */ `
  attribute vec2 aPos;
  void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

/**
 * PS3 XMB wave — single braided tendril.
 *
 * Reference: real PS3 dashboard frames show a single thin ribbon flowing L→R,
 * composed of 2-3 sub-strands that braid around each other. There is a bright
 * concentrated "head" on the left where the strand sources from, and the
 * ribbon tapers in brightness moving right. The wave reads as WHITE on top of
 * a theme-tinted background gradient — the theme color does not tint the wave
 * itself.
 *
 * This shader outputs white (alpha-modulated) intensity. The page body
 * provides the theme-tinted radial gradient underneath; additive blending
 * over that gradient produces the final look.
 */
export const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uTint; // kept for compat; head glow picks up a tiny bit of tint

  // hash helpers for sparkle field
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Distance from uv to one tendril strand at horizontal position x.
  // Each strand follows a smooth wave with multiple frequency components.
  // The "slope" parameter tilts the baseline so the ribbon can flow from
  // lower-left to upper-right (or vice versa) over the screen, matching
  // the PS3 reference's variable slope across frames.
  float strand(vec2 uv, float t, float freq, float amp, float phase, float baseY, float slope) {
    float x = uv.x;
    // base curve: big slow arc + medium frequency variation + tiny high-frequency wiggle
    float waveY = baseY
                + slope * (x - 0.5)                                    // overall diagonal
                + sin(x * freq * 0.7 + t * 0.8 + phase) * amp * 1.6    // big arc
                + sin(x * freq + t + phase) * amp                       // mid
                + sin(x * freq * 1.9 + t * 0.6 + phase) * amp * 0.35;  // fine detail
    return abs(uv.y - waveY);
  }

  // Soft ribbon intensity at a given distance with a given core thickness.
  // Two-zone falloff: a bright core (sharp) plus a wider halo (gentle).
  // This matches the PS3 reference where each strand has a thin bright
  // centerline plus a soft surrounding glow.
  float ribbon(float d, float core) {
    float coreI = pow(1.0 - clamp(d / core, 0.0, 1.0), 1.4);
    float halo  = pow(1.0 - clamp(d / (core * 3.5), 0.0, 1.0), 2.0) * 0.55;
    return coreI + halo;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float t = uTime * 0.35;

    // The ribbon's "anchor" Y drifts slowly so the whole wave breathes
    float anchorY = 0.50 + sin(uTime * 0.08) * 0.05;
    // Slope drifts so the wave flows uphill, flat, then downhill across long
    // timescales (matches the PS3 reference's variable slope across frames).
    float slope = sin(uTime * 0.05) * 0.14;

    // 3 braided strands at slightly different phases. Critically, all strands
    // share the SAME slope and very close base Y values so they cluster into
    // a tight braided band rather than fanning apart — matches the PS3
    // reference where the wave reads as a single intertwined ribbon.
    float d1 = strand(uv, t,        2.4, 0.045, 0.0,  anchorY,          slope);
    float d2 = strand(uv, t * 1.05, 2.7, 0.038, 1.4,  anchorY + 0.006,  slope);
    float d3 = strand(uv, t * 0.95, 2.1, 0.032, 2.9,  anchorY - 0.005,  slope);

    float r1 = ribbon(d1, 0.018);
    float r2 = ribbon(d2, 0.014);
    float r3 = ribbon(d3, 0.012);

    // composite strands (max picks the brightest strand at each pixel, which
    // gives the "braided over each other" look rather than just adding bands)
    float ribbonI = max(max(r1, r2), r3) * 0.85 + (r1 + r2 + r3) * 0.05;

    // Alpha falloff along X: bright on the left, tapers toward the right.
    // Slight head boost at the very left edge.
    float xFalloff = pow(1.0 - uv.x, 1.2);   // 1.0 at left → 0.0 at right
    xFalloff = clamp(xFalloff, 0.0, 1.0);

    // Head glow: bright radial blob just on-screen at the left, sitting on
    // the ribbon's anchor line. This is the "source" where the ribbon
    // emerges from and where sparkles cluster.
    float headSlope = slope * (0.05 - 0.5);
    vec2 headPos = vec2(0.05, anchorY + headSlope);
    // Aspect-corrected distance (without this, the head reads as a horizontal
    // ellipse on widescreen)
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    float headDist = distance(uv * aspect, headPos * aspect);
    float head = exp(-headDist * 22.0) * 0.95;    // tight bright core
    head += exp(-headDist * 10.0) * 0.35;         // medium halo
    head += exp(-headDist * 4.5) * 0.10;          // soft bloom

    // Sparkle field: pseudo-random points that flicker. Density falls off with
    // X just like the ribbon, and intensifies near the head.
    vec2 sparkleUV = uv * vec2(180.0, 100.0);
    vec2 sparkleId = floor(sparkleUV);
    vec2 sparkleFrac = fract(sparkleUV) - 0.5;
    float sparkleSeed = hash21(sparkleId);
    float sparkleVis = step(0.985, sparkleSeed); // very sparse
    float sparkleFlicker = 0.5 + 0.5 * sin(uTime * (1.0 + sparkleSeed * 4.0) + sparkleSeed * 6.28);
    float sparkleShape = exp(-dot(sparkleFrac, sparkleFrac) * 60.0);
    float sparkleField = sparkleVis * sparkleShape * sparkleFlicker;
    // weight sparkles by proximity to ribbon AND to head
    float sparkleWeight = ribbonI * 1.2 + head * 1.5 + 0.12;
    sparkleWeight *= xFalloff;
    float sparkles = sparkleField * sparkleWeight * 3.5;

    // Total white intensity
    float intensity = ribbonI * xFalloff * 1.1 + head + sparkles;
    intensity = clamp(intensity, 0.0, 1.0);

    if (intensity <= 0.01) discard;

    // Output white-with-faint-tint at intensity-derived alpha.
    // Slight tint bleed (~10%) so the wave doesn't feel surgically detached
    // from the theme — keeps it cohesive with the background gradient.
    vec3 col = mix(vec3(1.0), uTint, 0.12);
    gl_FragColor = vec4(col * intensity, intensity * 0.92);
  }
`;
