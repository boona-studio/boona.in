import { BeforeAfter } from "../components/BeforeAfter";
import { Card } from "../components/Card";
import { CaseStudyCard } from "../components/CaseStudyCard";
import { CtaBand } from "../components/CtaBand";
import { Hero } from "../components/Hero";
import { Readout } from "../components/Readout";
import { Section } from "../components/Section";
import { Testimonial } from "../components/Testimonial";
import { caseBySlug, cases } from "../content/cases";
import { NotFound } from "./NotFound";

export function Cases() {
  return (
    <>
      <Hero size="page" title="Receipts." lead="Every number here has a window and a method. Teams are described, companies are not named." primary={{ label: "Work with me", href: "#/contact" }} />
      <Section title="Case studies">
        <div className="grid gap-6 md:grid-cols-2">
          {cases.map((c) => (
            <CaseStudyCard key={c.slug} context={c.context} when={c.when} title={c.title} summary={c.summary} href={`#/work/cases/${c.slug}`} readout={{ accent: c.accent ?? "automation", label: c.metricLabel, number: `${c.before.value} → ${c.after.value}`, unit: c.unit, window: c.window }} />
          ))}
        </div>
      </Section>
      <CtaBand headline="If you want a number like this for your team, book a 30-minute call." note="I will tell you if it is not a fit." primary={{ label: "Book a scoping call", href: "#/contact" }} className="mt-16" />
    </>
  );
}

export function CaseStudy({ slug }: { slug: string }) {
  const c = caseBySlug(slug);
  if (!c) return <NotFound />;
  return (
    <>
      <header className="mx-auto max-w-container px-gutter pt-16 pb-8 border-t-heavy border-ink flex flex-col gap-4">
        <p className="text-small text-quiet m-0">{c.context} · {c.when}</p>
        <h1 className="text-h1 m-0 max-w-[24ch]">{c.title}</h1>
        <p className="text-lead m-0 max-w-measure">{c.summary}</p>
      </header>
      <div className="mx-auto max-w-container px-gutter">
        <Readout size="lg" accent={c.accent ?? "automation"} label={c.metricLabel} number={`${c.before.value} → ${c.after.value}`} unit={c.unit} window={c.window} />
      </div>

      <Section title="Before">
        <p className="text-body m-0 max-w-measure">{c.before.story}</p>
      </Section>
      <Section title="What changed">
        <p className="text-body m-0 max-w-measure">{c.after.story}</p>
      </Section>
      <Section title="The number">
        <div className="max-w-measure">
          <BeforeAfter label={c.title} before={{ value: c.before.value, note: c.before.note }} after={{ value: c.after.value, note: c.after.note }} unit={c.unit} window={c.window} accent={c.accent ?? "automation"} />
        </div>
      </Section>
      <Section title="What still needs a human">
        <Card tone="surface" className="max-w-measure"><p className="text-body m-0">{c.stillHuman}</p></Card>
      </Section>
      {c.quote && (
        <Section title="A word from the team">
          <Testimonial quote={c.quote.text} attribution={c.quote.attribution} />
        </Section>
      )}
      <CtaBand headline="Want a number like this for your team?" note="Thirty minutes, and I will say if it is not a fit." primary={{ label: "Book a scoping call", href: "#/contact" }} secondary={{ label: "More case studies", href: "#/work/cases" }} className="mt-16" />
    </>
  );
}
