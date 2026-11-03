import { Button } from "./Button";
import { Link } from "./Link";
import { Readout, type ReadoutProps } from "./Readout";
import { cn } from "../lib/cn";

export type HeroProps = {
  title: string;
  lead?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** Transparent cut-out. Rendered in front of the readout bar; the head breaks above the title rule. */
  photo?: { src: string; alt: string };
  /** The bar under the hero. Omit on pages with no number. */
  readout?: ReadoutProps;
  /** "page" = smaller title for inner pages. */
  size?: "home" | "page";
  className?: string;
};

/**
 * Hero — the house opening: headline, who line, two actions, the cut-out standing in front of the readout bar.
 * Depth comes from layering only: no shadow, no gradient.
 */
export function Hero({ title, lead, primary, secondary, photo, readout, size = "home", className }: HeroProps) {
  return (
    <header className={cn("relative mx-auto max-w-container px-gutter", className)}>
      <div className={cn("grid gap-8 pt-16 pb-10 border-t-heavy border-ink", photo && "md:grid-cols-[minmax(0,1fr)_minmax(280px,38%)]")}>
        <div className="flex flex-col gap-6 min-w-0">
          <h1 className={cn("m-0", size === "home" ? "text-hero max-w-[14ch]" : "text-h1 max-w-[20ch]")}>{title}</h1>
          {lead && <p className="text-lead m-0 max-w-measure">{lead}</p>}
          {(primary || secondary) && (
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {primary && <Button href={primary.href} size="lg">{primary.label}</Button>}
              {secondary && <Link href={secondary.href} tone="standalone">{secondary.label}</Link>}
            </div>
          )}
        </div>
        {photo && (
          <div className="relative min-h-[280px] md:min-h-0">
            <img
              src={photo.src}
              alt={photo.alt}
              className="absolute bottom-0 right-0 w-[min(100%,420px)] h-auto z-raised pointer-events-none select-none md:-mb-16"
              style={{ marginBottom: readout ? undefined : 0 }}
            />
          </div>
        )}
      </div>
      {readout && <Readout size="lg" {...readout} />}
    </header>
  );
}

export default Hero;
