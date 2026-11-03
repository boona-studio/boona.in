import { Button } from "./Button";
import { Card } from "./Card";
import { Link } from "./Link";
import { Readout, type ReadoutAccent, type ReadoutProps } from "./Readout";

export type PricingModel = "SaaS" | "Self-hosted" | "Pay as you use" | "Subscription" | "Developer licence";

export type ProductCardProps = {
  name: string;
  /** One sentence, what it does. */
  oneLine: string;
  /** Who it is for, one line. */
  audience?: string;
  /** How it is sold. Rendered as a plain list: "SaaS or self-hosted · pay as you use". */
  pricing: PricingModel[];
  /** Honest line on what it does not do yet. Required: a product entry without it is not on-brand. */
  missing: string;
  accent: Exclude<ReadoutAccent, "lost" | "none">;
  readout: Omit<ReadoutProps, "size" | "accent">;
  /** Product page or try-it link. */
  href: string;
  /** Link to the services page. Defaults to /work. */
  buildHref?: string;
  version?: string;
};

/**
 * ProductCard — a product entry with its readout, its pricing model, what is missing, and the path to
 * "I can build this for you". Products are named freely; this is Boona's own work.
 */
export function ProductCard({ name, oneLine, audience, pricing, missing, accent, readout, href, buildHref = "/work", version }: ProductCardProps) {
  return (
    <Card as="article" tone="outline" padding="md" className="flex flex-col gap-4">
      <div className="flex items-baseline gap-3">
        <h3 className="text-h3 m-0">{name}</h3>
        {version && <span className="text-small text-quiet tnum">{version}</span>}
      </div>
      <p className="text-body m-0 max-w-measure">{oneLine}</p>
      {audience && <p className="text-small text-quiet m-0">For {audience}.</p>}
      <Readout size="md" accent={accent} {...readout} />
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-small m-0">
        <dt className="text-quiet">How you get it</dt>
        <dd className="m-0">{pricing.join(" · ")}</dd>
        <dt className="text-quiet">Not yet</dt>
        <dd className="m-0">{missing}</dd>
      </dl>
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button href={href} variant="primary" size="md">Try {name}</Button>
        <Link href={buildHref} tone="standalone">I can build this for you</Link>
      </div>
    </Card>
  );
}

export default ProductCard;
