import { cn } from "../lib/cn";
import type { ReadoutAccent } from "./Readout";

export type BeforeAfterProps = {
  /** What was measured: "Hours per week on invoice matching". */
  label: string;
  before: { value: number; note?: string };
  after: { value: number; note?: string };
  unit: string;
  /** "over 4 weeks". Required: a comparison without a window is not proof. */
  window: string;
  /** Which direction is good. Lower is the default for time and cost. */
  better?: "lower" | "higher";
  accent?: Exclude<ReadoutAccent, "none">;
  className?: string;
};

const ACCENT_BG: Record<Exclude<ReadoutAccent, "none">, string> = {
  azhagi: "bg-product-azhagi-accent",
  cue: "bg-product-cue-accent",
  automation: "bg-product-automation-accent",
  lost: "bg-warning-outage",
};

/**
 * BeforeAfter — two bars, same scale, the number at the end of each. The "after" bar takes the accent only when it
 * moved in the better direction; otherwise both bars stay ink so a regression is never dressed up.
 */
export function BeforeAfter({ label, before, after, unit, window: win, better = "lower", accent = "automation", className }: BeforeAfterProps) {
  const max = Math.max(before.value, after.value, 1);
  const improved = better === "lower" ? after.value < before.value : after.value > before.value;
  const delta = before.value === 0 ? null : Math.round(((after.value - before.value) / before.value) * 100);
  const pct = (v: number) => `${Math.max(2, Math.round((v / max) * 100))}%`;
  const fmt = (v: number) => v.toLocaleString("en-IN");

  const Row = ({ name, value, note, fill }: { name: string; value: number; note?: string; fill: string }) => (
    <div className="grid grid-cols-[5ch_1fr_auto] items-center gap-x-4">
      <span className="text-small text-quiet">{name}</span>
      <div className="h-3 bg-line rounded-none" role="presentation">
        <div className={cn("h-full rounded-none", fill)} style={{ width: pct(value) }} />
      </div>
      <span className="text-h4 tnum whitespace-nowrap">{fmt(value)} {unit}</span>
      {note && <span className="col-start-2 col-span-2 text-caption text-quiet">{note}</span>}
    </div>
  );

  return (
    <figure className={cn("m-0 flex flex-col gap-3 border-t-heavy border-ink pt-4", className)} aria-label={`${label}: before ${fmt(before.value)} ${unit}, after ${fmt(after.value)} ${unit}, ${win}`}>
      <figcaption className="flex items-baseline justify-between gap-4">
        <span className="text-h4">{label}</span>
        <span className="text-small text-quiet">{win}</span>
      </figcaption>
      <Row name="before" value={before.value} note={before.note} fill="bg-ink" />
      <Row name="after" value={after.value} note={after.note} fill={improved ? ACCENT_BG[accent] : "bg-ink"} />
      {delta !== null && (
        <p className={cn("m-0 text-small tnum", improved ? "text-ink" : "text-warning-outage-ink")}>
          {delta > 0 ? "+" : ""}{delta}% {improved ? "" : "(worse)"}
        </p>
      )}
    </figure>
  );
}

export default BeforeAfter;
