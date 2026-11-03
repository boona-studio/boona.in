import { useEffect, useSyncExternalStore } from "react";

/**
 * Tiny hash router, no dependency. Routes are "#/path"; params are ":name" segments.
 * Swap for a history router when the site moves to server rendering; pages only depend on `params`.
 */
export type Route = { path: string; title: string; render: (params: Record<string, string>) => React.ReactElement };

function currentPath(): string {
  const h = typeof window === "undefined" ? "" : window.location.hash;
  const p = h.replace(/^#/, "") || "/";
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
}

function subscribe(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

export function usePath(): string {
  return useSyncExternalStore(subscribe, currentPath, () => "/");
}

export function match(routes: Route[], path: string): { route: Route; params: Record<string, string> } | null {
  const segs = path.split("/").filter(Boolean);
  for (const route of routes) {
    const rsegs = route.path.split("/").filter(Boolean);
    if (rsegs.length !== segs.length) continue;
    const params: Record<string, string> = {};
    let ok = true;
    for (let i = 0; i < rsegs.length; i++) {
      if (rsegs[i].startsWith(":")) params[rsegs[i].slice(1)] = decodeURIComponent(segs[i]);
      else if (rsegs[i] !== segs[i]) { ok = false; break; }
    }
    if (ok) return { route, params };
  }
  return null;
}

/** Scroll to top and move focus to the main landmark on every route change. */
export function useRouteFocus(path: string) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
    const main = document.getElementById("main");
    if (main) { main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
  }, [path]);
}
