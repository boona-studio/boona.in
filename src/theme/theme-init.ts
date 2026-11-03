/**
 * Theme bootstrap. Inline this in <head> BEFORE any stylesheet so the first paint is already in the chosen theme.
 * Reads the stored choice ("light" | "dark"); anything else means "system", which tokens.css handles with
 * prefers-color-scheme, so nothing is set and no flash occurs either way.
 *
 * Usage (Vite / Next): import { THEME_INIT } from "./theme/theme-init"; render <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
 */
export const THEME_STORAGE_KEY = "boona-theme";

export const THEME_INIT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;
