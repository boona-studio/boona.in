import { useId } from "react";
import { cn } from "../lib/cn";

export type SectionProps = {
  title?: string;
  /** One line under the title. */
  lead?: string;
  /** Right-aligned link next to the title: { label, href }. */
  aside?: { label: string; href: string };
  children: React.ReactNode;
  className?: string;
};

/**
 * Section — a page section with a heavy top rule and an h2. The rule carries the hierarchy; no cards needed.
 */
export function Section({ title, lead, aside, children, className }: SectionProps) {
  const id = useId();
  return (
    <section aria-labelledby={title ? id : undefined} className={cn("mx-auto max-w-container px-gutter", className)}>
      <div className="border-t-heavy border-ink py-16">
      {title && (
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <h2 id={id} className="text-h2 m-0">{title}</h2>
            {lead && <p className="text-lead text-quiet m-0 max-w-measure">{lead}</p>}
          </div>
          {aside && <a href={aside.href} className="text-small font-medium underline underline-offset-4">{aside.label}</a>}
        </div>
      )}
      {children}
      </div>
    </section>
  );
}

export default Section;
