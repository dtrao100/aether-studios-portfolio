export const VERTEX_SHADER = /* glsl */ `
  attribute vec2 aPos;
  void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

/**
 * Diffuse cloud-volume wave (PS3 XMB style).
 *
 * Earlier iterations rendered sharp sine ribbons (lineWidth ~0.1, sharpness 15+).
 * The real PS3 wave reads as soft volumetric haze, not crisp lines, so:
 *   - lineWidth bumped to 0.25-0.45 (much wider bands)
 *   - sharpness dropped to 2-4 (gentle falloff, no harp edges)
 *   - reduced layer count slightly to keep accumulation from over-brightening
 *   - final alpha lowered so the wave reads as ambient haze that doesn't fight
 *     with the body gradient
 */
export const FRAGMENT_SHADER = /* glsl */ `
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
    if (invertFalloff) {
      if (deltaY > 0.0) d *= 3.0;
    } else {
      if (deltaY < 0.0) d *= 3.0;
    }
    float sm = smoothstep(lineWidth * waveWidthFactor, 0.0, d);
    float sc = pow(sm, sharpness);
    return min(baseColor * sc, baseColor);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec3 base = uTint;
    vec3 c = vec3(0.0);
    // forward-falloff (visible above the wave line): broader, slower
    c += calcSine(uv, 0.18, 0.18, 0.18, 0.0, 0.50, base, 0.38, 2.8, false);
    c += calcSine(uv, 0.32, 0.36, 0.14, 0.0, 0.52, base, 0.28, 3.5, false);
    c += calcSine(uv, 0.24, 0.55, 0.12, 0.0, 0.48, base, 0.24, 4.0, false);
    // inverted-falloff (visible below the wave line): brighter highlights
    c += calcSine(uv, 0.12, 0.24, 0.08, 0.0, 0.34, base, 0.26, 3.5, true);
    c += calcSine(uv, 0.28, 0.34, 0.07, 0.0, 0.32, base, 0.22, 4.0, true);
    // clamp before alpha so over-accumulation doesn't blow out the center
    c = min(c, base);
    float m = max(max(c.r, c.g), c.b);
    if (m <= 0.0) discard;
    gl_FragColor = vec4(c, m * 0.48);
  }
`;
