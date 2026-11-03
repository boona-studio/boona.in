// Generated from design/tokens.json. Do not edit by hand; change tokens.json and run design/scripts/build-tokens.mjs.
import type { Config } from "tailwindcss";
import raw from "./design/build/tailwind.tokens.json";

type FontSizeEntry = [string, { lineHeight: string; letterSpacing: string; fontWeight: string }];
const tokens = { ...raw, fontSize: raw.fontSize as unknown as Record<string, FontSizeEntry> };

export default {
  content: ["./src/**/*.{ts,tsx,html,mdx}"],
  darkMode: ["selector", '[data-theme="dark"]'], // system preference is handled in tokens.css; this selector is the manual override
  theme: {
    screens: tokens.screens,
    fontFamily: tokens.fontFamily,
    extend: {
      colors: tokens.colors,
      fontSize: tokens.fontSize,
      fontWeight: tokens.fontWeight,
      spacing: tokens.spacing,
      borderRadius: tokens.borderRadius,
      borderWidth: tokens.borderWidth,
      outlineWidth: tokens.outlineWidth,
      outlineOffset: tokens.outlineOffset,
      boxShadow: tokens.boxShadow,
      zIndex: tokens.zIndex,
      transitionDuration: tokens.transitionDuration,
      transitionTimingFunction: tokens.transitionTimingFunction,
      maxWidth: tokens.maxWidth,
      height: tokens.height,
      minHeight: tokens.minHeight,
      minWidth: tokens.minWidth,
      width: tokens.width,
    },
  },
  plugins: [],
} satisfies Config;
