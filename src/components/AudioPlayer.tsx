"use client";

import { useEffect, useRef, useState } from "react";

type AudioPlayerProps = {
  src: string;
  title: string;
};

export function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.6);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setTime(a.currentTime);
    const onDur = () => setDuration(a.duration || 0);
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onDur);
    a.addEventListener("ended", onEnd);
    a.volume = volume;
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onDur);
      a.removeEventListener("ended", onEnd);
    };
  }, [volume]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      void a.play();
      setPlaying(true);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Number(e.target.value);
    setTime(a.currentTime);
  };

  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${r.toString().padStart(2, "0")}`;
  };

  return (
    <div style={s.shell}>
      <audio ref={audioRef} src={src} loop preload="metadata" />
      <div style={s.row}>
        <button type="button" onClick={toggle} style={s.playBtn} aria-label={playing ? "Pause" : "Play"}>
          {playing ? "⏸" : "▶"}
        </button>
        <div style={s.titleCol}>
          <div style={s.title}>{title}</div>
          <div style={s.time}>{fmt(time)} / {fmt(duration)}</div>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={time}
        onChange={seek}
        style={s.seek}
        aria-label="Seek"
      />
      <div style={s.volRow}>
        <span style={s.volLabel}>Volume</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={s.volSlider}
          aria-label="Volume"
        />
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  shell: {
    background: "rgba(10, 14, 28, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: 8,
    padding: 20,
    maxWidth: 520,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
  row: { display: "flex", alignItems: "center", gap: 16, marginBottom: 16 },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    background: "rgba(255, 255, 255, 0.10)",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    color: "white",
    fontSize: 18,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  titleCol: { display: "flex", flexDirection: "column", gap: 4 },
  title: { fontSize: 16, color: "white", fontWeight: 500 },
  time: { fontSize: 12, opacity: 0.6, fontVariantNumeric: "tabular-nums" },
  seek: { width: "100%", marginBottom: 12, accentColor: "white" },
  volRow: { display: "flex", alignItems: "center", gap: 10 },
  volLabel: { fontSize: 11, opacity: 0.55, letterSpacing: 1, textTransform: "uppercase" },
  volSlider: { flex: 1, accentColor: "white" },
};
