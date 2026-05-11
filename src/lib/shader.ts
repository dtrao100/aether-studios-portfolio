export const VERTEX_SHADER = /* glsl */ `
  attribute vec2 aPos;
  void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  const float waveWidthFactor = 1.5;

  vec3 calcSine(vec2 uv, float speed, float frequency, float amplitude,
                float phaseShift, float verticalOffset, vec3 baseColor,
                float lineWidth, float sharpness, bool invertFalloff) {
    float angle = uTime * speed * frequency * -1.0 + (phaseShift + uv.x) * 2.0;
    float waveY = sin(angle) * amplitude + verticalOffset;
    float deltaY = waveY - uv.y;
    float d = distance(waveY, uv.y);
    if (invertFalloff) {
      if (deltaY > 0.0) d *= 4.0;
    } else {
      if (deltaY < 0.0) d *= 4.0;
    }
    float sm = smoothstep(lineWidth * waveWidthFactor, 0.0, d);
    float sc = pow(sm, sharpness);
    return min(baseColor * sc, baseColor);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec3 base = vec3(0.55);
    vec3 c = vec3(0.0);
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
