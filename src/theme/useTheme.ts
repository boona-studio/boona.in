import { useCallback, useEffect, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "./theme-init";

export type ThemeChoice = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function readChoice(): ThemeChoice {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

function systemTheme(): ResolvedTheme {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function apply(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", choice);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystem = () => cb();
  const onStorage = (e: StorageEvent) => { if (e.key === THEME_STORAGE_KEY) { apply(readChoice()); cb(); } };
  mq.addEventListener("change", onSystem);
  window.addEventListener("storage", onStorage); // keeps two open tabs in step
  return () => { listeners.delete(cb); mq.removeEventListener("change", onSystem); window.removeEventListener("storage", onStorage); };
}

/**
 * useTheme — the one place the theme is read or changed.
 * choice: what the visitor picked ("system" by default). resolved: what is actually showing.
 */
export function useTheme() {
  const choice = useSyncExternalStore(subscribe, readChoice, () => "system" as ThemeChoice);
  const resolved: ResolvedTheme = choice === "system" ? (typeof window === "undefined" ? "light" : systemTheme()) : choice;

  useEffect(() => { apply(choice); }, [choice]);

  const setChoice = useCallback((next: ThemeChoice) => {
    try {
      if (next === "system") localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch { /* private mode: still apply for this page */ }
    apply(next);
    emit();
  }, []);

  return { choice, resolved, setChoice } as const;
}
