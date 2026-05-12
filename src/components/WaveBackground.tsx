"use client";

import { useEffect, useRef } from "react";
import { FRAGMENT_SHADER, VERTEX_SHADER } from "@/lib/shader";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { computeTint, getActiveTheme, type ThemeId } from "@/lib/theme";

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();
  const reducedRef = useRef(reducedMotion);
  const themeRef = useRef<ThemeId>("drift");

  useEffect(() => {
    reducedRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) {
      console.warn("WebGL not available — wave will not render.");
      return;
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const compile = (src: string, type: number) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(VERTEX_SHADER, gl.VERTEX_SHADER);
    const fs = compile(FRAGMENT_SHADER, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const posLoc = gl.getAttribLocation(program, "aPos");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uRes = gl.getUniformLocation(program, "uResolution");
    const uTint = gl.getUniformLocation(program, "uTint");

    // hydrate theme from localStorage, listen for changes
    themeRef.current = getActiveTheme();
    const onThemeChange = (e: Event) => {
      const detail = (e as CustomEvent<ThemeId>).detail;
      if (detail) themeRef.current = detail;
    };
    window.addEventListener("aether-theme-change", onThemeChange);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0, 0, 0, 0);

    let frozenT = 0;
    let renderedFrozenFrame = false;
    let raf = 0;

    const frame = (t: number) => {
      const isReduced = reducedRef.current;
      const sec = t * 0.001;
      const [r, g, b] = computeTint(themeRef.current, isReduced ? frozenT : sec);
      if (isReduced) {
        if (!renderedFrozenFrame) {
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.uniform1f(uTime, frozenT);
          gl.uniform2f(uRes, canvas.width, canvas.height);
          gl.uniform3f(uTint, r, g, b);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          renderedFrozenFrame = true;
        }
      } else {
        renderedFrozenFrame = false;
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uTime, sec);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform3f(uTint, r, g, b);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        frozenT = sec;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("aether-theme-change", onThemeChange);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
