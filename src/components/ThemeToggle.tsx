import { useId } from "react";
import { useTheme, type ThemeChoice } from "../theme/useTheme";

/**
 * ThemeToggle — three-way control: System / Light / Dark.
 * Square, ink outline, 44px tall (size.touch). The selected option is filled with ink.
 * Renders as a radiogroup so screen readers announce "Theme, Dark, selected, 3 of 3".
 */
export type ThemeToggleProps = {
  /** "full" shows labels; "compact" shows icons with a visually hidden label (nav on phones). */
  variant?: "full" | "compact";
  className?: string;
};

const OPTIONS: { value: ThemeChoice; label: string; icon: JSX.Element }[] = [
  {
    value: "system",
    label: "System",
    icon: (
      <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="2.75" y="3.75" width="14.5" height="9.5" rx="0" />
        <path d="M7 16.25h6M10 13.25v3" />
      </svg>
    ),
  },
  {
    value: "light",
    label: "Light",
    icon: (
      <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="10" cy="10" r="3.25" />
        <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M15.5 12.4A6.5 6.5 0 0 1 7.6 4.5a6.5 6.5 0 1 0 7.9 7.9Z" />
      </svg>
    ),
  },
];

export function ThemeToggle({ variant = "full", className = "" }: ThemeToggleProps) {
  const { choice, setChoice } = useTheme();
  const groupId = useId();

  return (
    <div
      role="radiogroup"
      aria-labelledby={`${groupId}-label`}
      className={`inline-flex self-start w-fit border-rule border-ink rounded-none ${className}`}
    >
      <span id={`${groupId}-label`} className="sr-only">Theme</span>
      {OPTIONS.map((o) => {
        const selected = choice === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={variant === "compact" ? o.label : undefined}
            onClick={() => setChoice(o.value)}
            className={[
              "inline-flex items-center gap-2 h-touch min-w-touch px-3 text-small font-medium rounded-none",
              "transition-colors duration-fast ease-standard",
              "focus-visible:outline focus-visible:outline-heavy focus-visible:outline-focus focus-visible:outline-offset-[-2px]",
              selected ? "bg-ink text-on-ink" : "bg-ground text-ink hover:bg-surface",
            ].join(" ")}
          >
            {o.icon}
            {variant === "full" && <span>{o.label}</span>}
          </button>
        );
      })}
    </div>
  );
}

export default ThemeToggle;
