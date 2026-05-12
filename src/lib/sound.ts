"use client";

/**
 * PS3-style sound system. Off by default — user opts in via Settings → Sound.
 * Persists choice in localStorage. Background ambient is a separate toggle from
 * navigation effects so users can have one without the other.
 */

export type SoundName = "nav" | "navUp" | "navDown" | "ok" | "cancel" | "unlock";

const SOURCES: Record<SoundName, string> = {
  nav: "/audio/down.ogg", // generic tick for horizontal nav
  navUp: "/audio/up.ogg",
  navDown: "/audio/down.ogg",
  ok: "/audio/ok.ogg",
  cancel: "/audio/cancel.ogg",
  unlock: "/audio/unlock.ogg",
};

const FX_KEY = "aether_sound_fx_enabled";
const BGM_KEY = "aether_sound_bgm_enabled";
const FX_VOLUME = 0.4;
const BGM_VOLUME = 0.18;

const cache: Partial<Record<SoundName, HTMLAudioElement>> = {};
let bgm: HTMLAudioElement | null = null;

function isClient() {
  return typeof window !== "undefined";
}

export function isFxEnabled(): boolean {
  if (!isClient()) return false;
  return window.localStorage.getItem(FX_KEY) === "true";
}

export function isBgmEnabled(): boolean {
  if (!isClient()) return false;
  return window.localStorage.getItem(BGM_KEY) === "true";
}

export function play(name: SoundName) {
  if (!isClient() || !isFxEnabled()) return;
  let audio = cache[name];
  if (!audio) {
    audio = new Audio(SOURCES[name]);
    audio.volume = FX_VOLUME;
    audio.preload = "auto";
    cache[name] = audio;
  }
  try {
    audio.currentTime = 0;
    void audio.play();
  } catch {
    // ignore
  }
}

export function setFxEnabled(enabled: boolean) {
  if (!isClient()) return;
  window.localStorage.setItem(FX_KEY, String(enabled));
}

function ensureBgm(): HTMLAudioElement {
  if (!bgm) {
    bgm = new Audio("/audio/bgm.ogg");
    bgm.loop = true;
    bgm.volume = BGM_VOLUME;
    bgm.preload = "auto";
  }
  return bgm;
}

export function setBgmEnabled(enabled: boolean) {
  if (!isClient()) return;
  window.localStorage.setItem(BGM_KEY, String(enabled));
  const audio = ensureBgm();
  if (enabled) {
    void audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

/** Call this on any user gesture (click, keypress) to start BGM if enabled.
 *  Browsers require a user gesture before audio autoplay; this hooks into that. */
export function maybeStartBgm() {
  if (!isClient() || !isBgmEnabled()) return;
  const audio = ensureBgm();
  if (audio.paused) {
    void audio.play().catch(() => {});
  }
}
