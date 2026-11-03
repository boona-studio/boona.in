import { Card } from "../components/Card";
import { CtaBand } from "../components/CtaBand";
import { Hero } from "../components/Hero";
import { Link } from "../components/Link";
import { ProductCard } from "../components/ProductCard";
import { ProductHero } from "../components/ProductHero";
import { Section } from "../components/Section";
import { productBySlug, products } from "../content/products";
import { site } from "../content/site";
import { NotFound } from "./NotFound";

export function Products() {
  return (
    <>
      <Hero size="page" title="Things I built." lead="Each one is judged by a number, says how you get it, and says what it does not do yet." primary={{ label: "Work with me", href: "#/contact" }} />
      <Section title="Products">
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((p) => (
            <ProductCard key={p.slug} name={p.name} version={p.version} oneLine={p.oneLine} audience={p.audience} pricing={p.pricing} missing={p.missing} accent={p.accent} readout={p.metric} href={p.href} buildHref="#/work" />
          ))}
        </div>
      </Section>
      <CtaBand tone="surface" headline="Want one of these for your business?" note="They run on the same pipeline I build for clients." primary={{ label: "Work with me", href: "#/contact" }} className="mt-16" />
    </>
  );
}

export function Product({ slug }: { slug: string }) {
  const p = productBySlug(slug);
  if (!p) return <NotFound />;
  return (
    <>
      <header className="mx-auto max-w-container px-gutter pt-16 pb-8 border-t-heavy border-ink flex flex-col gap-4">
        <p className="text-small text-quiet m-0 tnum">{p.name} {p.version}</p>
        <h1 className="text-h1 m-0 max-w-[20ch]">{p.name}</h1>
        <p className="text-lead m-0 max-w-measure">{p.oneLine}</p>
      </header>
      <div className="mx-auto max-w-container px-gutter">
        <ProductHero product={p} cameraSrc={site.photos.camera} />
      </div>

      <Section title="What it does">
        <div className="flex flex-col gap-4 max-w-measure">
          {p.about.map((para, i) => <p key={i} className="text-body m-0">{para}</p>)}
        </div>
      </Section>

      <Section title="How you get it">
        <div className="grid gap-6 md:grid-cols-2">
          <Card tone="outline">
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 m-0 text-body">
              <dt className="text-quiet">Model</dt><dd className="m-0">{p.pricing.join(" · ")}</dd>
              <dt className="text-quiet">Price</dt><dd className="m-0">[pricing]</dd>
              <dt className="text-quiet">For</dt><dd className="m-0">{p.audience}</dd>
            </dl>
          </Card>
          <Card tone="surface" className="flex flex-col gap-2">
            <span className="text-small font-medium">Not yet</span>
            <p className="text-body m-0">{p.missing}</p>
            {p.docsHref && <Link href={p.docsHref} tone="standalone">Read the docs</Link>}
          </Card>
        </div>
      </Section>

      <CtaBand tone="surface" headline="I can build this for you." note={`${p.name} runs on the same pipeline I build for clients. If your business needs its own, start with a scoping call.`} primary={{ label: "Book a scoping call", href: "#/contact" }} secondary={{ label: `Try ${p.name}`, href: p.href }} className="mt-16" />
    </>
  );
}
