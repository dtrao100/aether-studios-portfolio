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
  // Three-zone falloff: bright core line + tight halo + wider soft halo.
  // The reference shows each strand has a hairline bright center with a
  // significant SOFT glow around it — not crisp wireframe lines.
  float ribbon(float d, float core) {
    float coreI = pow(1.0 - clamp(d / core, 0.0, 1.0), 1.2);
    float halo  = pow(1.0 - clamp(d / (core * 5.0), 0.0, 1.0), 2.0) * 0.55;
    float soft  = pow(1.0 - clamp(d / (core * 9.0), 0.0, 1.0), 2.5) * 0.20;
    return coreI + halo + soft;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float t = uTime * 0.35;

    // The ribbon's "anchor" Y drifts slowly. gl_FragCoord has Y=0 at bottom,
    // so 0.38 means ~62% down from the top of screen (matches reference where
    // the wave sits in the lower-middle of the screen, head bottom-left).
    float anchorY = 0.38 + sin(uTime * 0.08) * 0.08;
    // Slope drifts more dramatically so the wave clearly arcs uphill/downhill
    // across long timescales (reference shows obvious up-down curves).
    float slope = sin(uTime * 0.05) * 0.28;

    // 5 thin braided strands clustered tightly around the anchor. The body
    // band underneath fills the ribbon's thickness; the strands act as
    // bright structural highlights within that band.
    float d1 = strand(uv, t,        2.0, 0.075, 0.0,  anchorY,          slope);
    float d2 = strand(uv, t * 1.06, 2.3, 0.068, 1.3,  anchorY + 0.012,  slope);
    float d3 = strand(uv, t * 0.94, 1.8, 0.058, 2.7,  anchorY - 0.010,  slope);
    float d4 = strand(uv, t * 1.02, 2.5, 0.062, 4.2,  anchorY + 0.020,  slope);
    float d5 = strand(uv, t * 0.97, 1.7, 0.054, 5.6,  anchorY - 0.018,  slope);

    // Strands are subtle highlights INSIDE the body band, not the primary
    // visible element. The reference reads as one unified ribbon with
    // braiding texture, so body dominates and strands are bright veins.
    float r1 = ribbon(d1, 0.010);
    float r2 = ribbon(d2, 0.009);
    float r3 = ribbon(d3, 0.008);
    float r4 = ribbon(d4, 0.008);
    float r5 = ribbon(d5, 0.007);

    // Wide diffuse smoke body — DOMINANT visual element. Three-zone
    // falloff (inner solid + outer fade + far halo) for the soft thick
    // ribbon shape.
    float bodyD = min(d1, min(d2, min(d3, min(d4, d5))));
    float bodyInner = pow(1.0 - clamp(bodyD / 0.035, 0.0, 1.0), 1.5) * 0.80;
    float bodyOuter = pow(1.0 - clamp(bodyD / 0.090, 0.0, 1.0), 2.4) * 0.35;
    float bodyFar   = pow(1.0 - clamp(bodyD / 0.150, 0.0, 1.0), 3.0) * 0.12;
    float body = bodyInner + bodyOuter + bodyFar;

    // Body dominates; strands add subtle bright-vein texture for braiding.
    float strandsMax = max(max(max(r1, r2), max(r3, r4)), r5);
    float ribbonI = body + strandsMax * 0.30;

    // Alpha falloff along X: brighter on the left, tapers toward the right
    // but still reaches the right edge with significant brightness. The
    // reference shows the wave visible across the FULL width — strong
    // near the head, attenuated but present at the right edge.
    float xFalloff = mix(1.0, 0.35, smoothstep(0.0, 0.9, uv.x));

    // Head glow: bright radial blob just on-screen at the left, sitting on
    // the ribbon's anchor line. This is the "source" where the ribbon
    // emerges from and where sparkles cluster.
    float headSlope = slope * (0.08 - 0.5);
    vec2 headPos = vec2(0.08, anchorY + headSlope);
    // Aspect-corrected distance (without this, the head reads as a horizontal
    // ellipse on widescreen)
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    float headDist = distance(uv * aspect, headPos * aspect);
    // Multi-zone glow matching the reference's bright source point
    float head = exp(-headDist * 32.0) * 1.20;    // ultra-tight bright nucleus
    head += exp(-headDist * 14.0) * 0.55;         // tight halo
    head += exp(-headDist * 6.0) * 0.22;          // medium glow
    head += exp(-headDist * 2.5) * 0.08;          // soft outer bloom

    // Sparkle field: pseudo-random bright points clustered near the head and
    // along the ribbon. The reference shows a TIGHT CLUSTER of small white
    // dots immediately around the source point, with a few scattered along
    // the wave path.
    vec2 sparkleUV = uv * vec2(220.0, 130.0);
    vec2 sparkleId = floor(sparkleUV);
    vec2 sparkleFrac = fract(sparkleUV) - 0.5;
    float sparkleSeed = hash21(sparkleId);
    float sparkleVis = step(0.978, sparkleSeed); // slightly denser
    float sparkleFlicker = 0.4 + 0.6 * sin(uTime * (1.0 + sparkleSeed * 4.0) + sparkleSeed * 6.28);
    float sparkleShape = exp(-dot(sparkleFrac, sparkleFrac) * 55.0);
    float sparkleField = sparkleVis * sparkleShape * sparkleFlicker;
    // Heavy weighting near the head (dominant cluster) plus light spread
    // along the ribbon path
    float headProx = exp(-headDist * 4.0);
    float sparkleWeight = ribbonI * 0.8 + head * 2.0 + headProx * 1.2 + 0.08;
    sparkleWeight *= xFalloff;
    float sparkles = sparkleField * sparkleWeight * 4.2;

    // Total white intensity
    float intensity = ribbonI * xFalloff * 0.85 + head + sparkles;
    intensity = clamp(intensity, 0.0, 1.0);

    if (intensity <= 0.01) discard;

    // Output white-with-faint-tint at intensity-derived alpha.
    // Slight tint bleed (~10%) so the wave doesn't feel surgically detached
    // from the theme — keeps it cohesive with the background gradient.
    vec3 col = mix(vec3(1.0), uTint, 0.12);
    gl_FragColor = vec4(col * intensity, intensity * 0.88);
  }
`;
