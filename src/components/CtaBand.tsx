import { Button } from "./Button";
import { cn } from "../lib/cn";

export type CtaBandProps = {
  /** One sentence, first person: "If you want a number like this for your team, book a 30-minute call." */
  headline: string;
  /** The honest second line: "I will tell you if it is not a fit." */
  note?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** "ink" = black band (end of page). "surface" = quiet band (mid page). */
  tone?: "ink" | "surface";
  className?: string;
};

/**
 * CtaBand — one ask per page. Full width, square, two buttons at most. Never stacked with another CTA.
 */
export function CtaBand({ headline, note, primary, secondary, tone = "ink", className }: CtaBandProps) {
  const dark = tone === "ink";
  return (
    <section aria-labelledby="cta-heading" className={cn("rounded-none", dark ? "bg-ink text-on-ink" : "bg-surface text-ink", className)}>
      <div className="mx-auto max-w-container px-gutter py-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2 max-w-measure">
          <h2 id="cta-heading" className="text-h2 m-0">{headline}</h2>
          {note && <p className={cn("text-lead m-0", dark ? "text-quiet-on-bar" : "text-quiet")}>{note}</p>}
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Button
            href={primary.href}
            size="lg"
            variant="primary"
            className={dark ? "bg-on-ink text-ink border-on-ink hover:bg-quiet-on-bar hover:border-quiet-on-bar" : undefined}
          >
            {primary.label}
          </Button>
          {secondary && (
            <Button
              href={secondary.href}
              size="lg"
              variant="secondary"
              className={dark ? "bg-transparent text-on-ink border-on-ink hover:bg-quiet" : undefined}
            >
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export default CtaBand;
