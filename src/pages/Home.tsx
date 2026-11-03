import { Card } from "../components/Card";
import { CaseStudyCard } from "../components/CaseStudyCard";
import { CtaBand } from "../components/CtaBand";
import { Hero } from "../components/Hero";
import { Link } from "../components/Link";
import { ProductCard } from "../components/ProductCard";
import { Section } from "../components/Section";
import { cases } from "../content/cases";
import { posts } from "../content/posts";
import { products } from "../content/products";
import { rules } from "../content/scars";
import { site } from "../content/site";

export function Home() {
  const latest = products[0];
  return (
    <>
      <Hero
        title={site.houseLine}
        lead={site.whoLine}
        primary={{ label: "Work with me", href: "#/contact" }}
        secondary={{ label: "See the readouts", href: "#/work/cases" }}
        photo={{ src: site.photos.cutout, alt: "Boopathi Thangamani" }}
        readout={{ accent: latest.accent, label: `${latest.name}, latest`, number: latest.metric.number, unit: latest.metric.unit, window: latest.metric.window, trailing: "boona.in", href: latest.href }}
      />

      <Section title="Receipts" lead="Every number here has a window and a method. Clients are not named." aside={{ label: "All case studies", href: "#/work/cases" }}>
        <div className="grid gap-6 md:grid-cols-2">
          {cases.slice(0, 2).map((c) => (
            <CaseStudyCard key={c.slug} context={c.context} when={c.when} title={c.title} summary={c.summary} href={`#/work/cases/${c.slug}`} readout={{ accent: c.accent ?? "automation", label: c.metricLabel, number: `${c.before.value} → ${c.after.value}`, unit: c.unit, window: c.window }} />
          ))}
        </div>
      </Section>

      <Section title="Things I built" lead="Each one is judged by a number, and each one says what it does not do yet." aside={{ label: "All products", href: "#/products" }}>
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((p) => (
            <ProductCard key={p.slug} name={p.name} version={p.version} oneLine={p.oneLine} audience={p.audience} pricing={p.pricing} missing={p.missing} accent={p.accent} readout={p.metric} href={p.href} buildHref="#/work" />
          ))}
        </div>
      </Section>

      <Section title="Three rules I paid for" lead="Two came from failures I tell in full on the about page. The third is the one I hire myself by." aside={{ label: "The scars", href: "#/about" }}>
        <ol className="grid gap-6 md:grid-cols-3 m-0 p-0 list-none">
          {rules.map((r) => (
            <Card key={r.rule} as="li" tone="ground" padding="none" className="pt-4 flex flex-col gap-2">
              <p className="text-h4 m-0">{r.rule}</p>
              <p className="text-small text-quiet m-0">{r.from}</p>
            </Card>
          ))}
        </ol>
      </Section>

      <Section title="Writing" lead="One idea per post, a number where there is one." aside={{ label: "All writing", href: "#/writing" }}>
        <ul className="m-0 p-0 list-none flex flex-col">
          {posts.map((p) => (
            <li key={p.slug} className="grid gap-2 md:grid-cols-[120px_minmax(0,1fr)_100px] py-5 border-t-hairline border-line">
              <span className="text-small text-quiet tnum">{p.date}</span>
              <div className="flex flex-col gap-1 min-w-0">
                <Link href={`#/writing/${p.slug}`} tone="standalone" className="no-underline hover:underline text-h4">{p.title}</Link>
                <span className="text-small text-quiet">{p.oneLine}</span>
              </div>
              <span className="text-small text-quiet md:text-right">{p.mode}</span>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand headline="If you want a number like this for your team, book a 30-minute call." note="I will tell you if it is not a fit." primary={{ label: "Book a scoping call", href: "#/contact" }} secondary={{ label: "See the receipts", href: "#/work/cases" }} className="mt-16" />
    </>
  );
}
