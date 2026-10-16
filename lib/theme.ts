"use client";

import { useSyncExternalStore } from "react";

// Light / dark theme: a `dark` class on <html> swaps the colour tokens in app/globals.css. The choice is kept in
// localStorage, applied before first paint by THEME_SCRIPT (app/layout.tsx), and followed by every open tab.
export type Theme = "light" | "dark";
const KEY = "mcl_theme";
const CHANGED = "mcl:theme";

/** Runs in <head> before the page paints, so a dark page never flashes light on load. */
export const THEME_SCRIPT = `try{if(localStorage.getItem("${KEY}")==="dark")document.documentElement.classList.add("dark")}catch(e){}`;

const read = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.dispatchEvent(new Event(CHANGED));
}

/** Switches the theme with a short cross-fade (instantly when the user prefers reduced motion). */
export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // storage blocked: the switch still applies to this page
  }
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!calm && document.startViewTransition) document.startViewTransition(() => apply(theme));
  else apply(theme);
}

function subscribe(onChange: () => void) {
  // Another tab switched: follow it.
  const fromOtherTab = (e: StorageEvent) => {
    if (e.key === KEY) apply(e.newValue === "dark" ? "dark" : "light");
  };
  window.addEventListener(CHANGED, onChange);
  window.addEventListener("storage", fromOtherTab);
  return () => {
    window.removeEventListener(CHANGED, onChange);
    window.removeEventListener("storage", fromOtherTab);
  };
}

/** The current theme; "light" while rendering on the server (the real one is applied before hydration). */
export const useTheme = () => useSyncExternalStore(subscribe, read, (): Theme => "light");
