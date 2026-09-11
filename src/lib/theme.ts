export const THEME_KEY = "cinq-theme";

export type Theme = "dark" | "light";

/**
 * Dark is the brand and the default. Light is opt-in and remembered. Runs
 * before paint so there is no flash of the wrong theme.
 */
export const themeInitScript = `(function(){try{if(localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)})==="light"){document.documentElement.classList.add("light");}}catch(e){}})();`;

export function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("light", theme === "light");
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = theme === "light" ? "#f4f1ea" : "#0c0b0a";
}

const listeners = new Set<() => void>();
let observer: MutationObserver | null = null;

/** Subscribe to theme changes by watching the root class list. */
export function subscribeTheme(cb: () => void) {
  listeners.add(cb);
  if (!observer && typeof document !== "undefined") {
    observer = new MutationObserver(() => listeners.forEach((l) => l()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  }
  return () => {
    listeners.delete(cb);
  };
}
