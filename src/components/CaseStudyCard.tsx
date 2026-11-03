import { Card } from "./Card";
import { Link } from "./Link";
import { Readout, type ReadoutProps } from "./Readout";

export type CaseStudyCardProps = {
  /** Anonymised context, never a name: "six-person ops team, logistics, Chennai". */
  context: string;
  /** What was done, as a headline: "Invoice matching, by hand to pipeline". */
  title: string;
  /** Two or three sentences. Say what still needs a human. */
  summary: string;
  /** The proof. accent defaults to "automation". */
  readout: Omit<ReadoutProps, "size" | "accent"> & { accent?: ReadoutProps["accent"] };
  href: string;
  /** Shown as a quiet line under the title: "2026, four weeks". */
  when?: string;
};

/**
 * CaseStudyCard — a client result. There is no `client` prop on purpose: context describes the team, never the company.
 */
export function CaseStudyCard({ context, title, summary, readout, href, when }: CaseStudyCardProps) {
  return (
    <Card as="article" tone="surface" padding="md" className="flex flex-col gap-4">
      <p className="text-small text-quiet m-0">{context}{when ? ` · ${when}` : ""}</p>
      <h3 className="text-h3 m-0">
        <Link href={href} tone="standalone" className="no-underline hover:underline">{title}</Link>
      </h3>
      <p className="text-body m-0 max-w-measure">{summary}</p>
      <Readout size="md" accent={readout.accent ?? "automation"} {...readout} />
      <Link href={href} tone="standalone" className="self-start">Read the case</Link>
    </Card>
  );
}

export default CaseStudyCard;
