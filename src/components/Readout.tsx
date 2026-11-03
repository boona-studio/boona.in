import { cn } from "../lib/cn";

/** Which square sits on the bar. "none" = founder-only surfaces (ink square). "lost" = scars, incidents. */
export type ReadoutAccent = "azhagi" | "cue" | "automation" | "lost" | "none";
export type ReadoutSize = "sm" | "md" | "lg";

export type ReadoutProps = {
  /** What was measured, in plain words: "camera to reply", "invoice matching, by hand". Required. */
  label: string;
  /** The measured number. Strings allowed for before→after pairs: "18 h → 4 h". Omit for Broad surfaces. */
  number?: string | number;
  /** "ms", "h/week", "%". Shown only when number is present. */
  unit?: string;
  /** How long or how many: "over 4 weeks", "over 200 calls". Shown only when number is present. */
  window?: string;
  accent?: ReadoutAccent;
  size?: ReadoutSize;
  /** Right-hand slot, e.g. "boona.in" on a lower third. */
  trailing?: React.ReactNode;
  /** Wrap the whole bar in a link. */
  href?: string;
  className?: string;
};

const ACCENT_BG: Record<ReadoutAccent, string> = {
  azhagi: "bg-product-azhagi-accent",
  cue: "bg-product-cue-accent",
  automation: "bg-product-automation-accent",
  lost: "bg-warning-outage",
  none: "bg-on-bar",
};

const SIZE = {
  sm: { bar: "min-h-bar-sm px-4 py-2 gap-x-3 gap-y-1 text-caption", number: "text-h4 font-bold", square: "w-[10px] h-[10px]" },
  md: { bar: "min-h-bar-md px-5 py-2 gap-x-4 gap-y-1 text-small", number: "text-h3 font-bold", square: "w-accent-square h-accent-square" },
  lg: { bar: "min-h-bar-lg px-6 py-3 gap-x-5 gap-y-1 text-readout-label", number: "text-readout-number", square: "w-accent-square h-accent-square" },
} as const;

/**
 * Readout — the proof block and the brand's sentence: [accent] label · number unit · window.
 * Black in both themes. With no `number` it carries only the label (Broad / Nurture surfaces); it never shows a
 * unit or window without a number, so a claim cannot be typed in without a measurement.
 */
export function Readout({ label, number, unit, window: win, accent = "none", size = "md", trailing, href, className }: ReadoutProps) {
  const s = SIZE[size];
  const hasNumber = number !== undefined && number !== null && String(number).trim() !== "";
  const sentence = hasNumber ? `${label}: ${number}${unit ? " " + unit : ""}${win ? ", " + win : ""}` : label;

  const content = (
    <>
      <span aria-hidden="true" className={cn("shrink-0 rounded-none", s.square, ACCENT_BG[accent])} />
      {/* Under 640px the label takes the first row and the measurement wraps beneath it; above, one row, label may truncate. */}
      <span className={cn("font-medium min-w-0", hasNumber ? "max-sm:basis-[calc(100%-2rem)] sm:truncate" : "truncate")}>{label}</span>
      {hasNumber && (
        <>
          <span className={cn("tnum whitespace-nowrap", s.number)}>{number}</span>
          {unit && <span className="whitespace-nowrap">{unit}</span>}
          {win && <span className="text-quiet-on-bar">{win}</span>}
        </>
      )}
      {trailing && <span className="ml-auto text-quiet-on-bar whitespace-nowrap">{trailing}</span>}
    </>
  );

  const base = cn(
    "readout flex flex-wrap items-center w-full min-w-0 rounded-none bg-bar text-on-bar",
    s.bar,
    href && "transition-colors duration-fast ease-standard hover:bg-ink focus-visible:outline focus-visible:outline-heavy focus-visible:outline-focus focus-visible:outline-offset-focus-offset",
    className
  );

  return href ? (
    <a href={href} className={base} aria-label={sentence}>{content}</a>
  ) : (
    <div role="group" aria-label={sentence} className={base}>{content}</div>
  );
}

export default Readout;
