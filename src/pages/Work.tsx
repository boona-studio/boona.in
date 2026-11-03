import { Card } from "../components/Card";
import { CaseStudyCard } from "../components/CaseStudyCard";
import { CtaBand } from "../components/CtaBand";
import { Hero } from "../components/Hero";
import { Readout } from "../components/Readout";
import { Section } from "../components/Section";
import { cases } from "../content/cases";
import { site } from "../content/site";

const services = [
  { title: "AI automation", body: "The workflow your team does by hand, done by a pipeline with a person on the exceptions. Invoices, onboarding, support triage, reporting.", judged: { label: "judged by", number: "hours", unit: "back per week", window: "measured over a stated window" }, accent: "automation" as const },
  { title: "An AI presence for your business", body: "Your own Azhagi: a front desk or coach that sees, listens and answers in real time, on your site or self-hosted.", judged: { label: "judged by", number: "ms", unit: "to reply", window: "and how many people come back" }, accent: "azhagi" as const },
  { title: "Engineering leadership and delivery", body: "I run the build with your team: realistic dates with a range, telemetry before the first user, a readout at the end.", judged: { label: "judged by", number: "dates", unit: "hit", window: "and incidents caught by the dashboard" }, accent: "none" as const },
];

const steps = [
  ["Scoping call", "Thirty minutes. I ask what you do by hand and what it costs. I say if it is not a fit."],
  ["Baseline", "Two weeks of measuring the current number before anything is built. No baseline, no claim."],
  ["Build, telemetry first", "The dashboard goes live before the first user does. Realistic dates, with a range."],
  ["Readout and handover", "The number, the window, the method, and what still needs a human. You own the code."],
];

export function Work() {
  return (
    <>
      <Hero size="page" title="AI software for your business, judged by a number." lead={site.belief} primary={{ label: "Book a scoping call", href: "#/contact" }} secondary={{ label: "See the receipts", href: "#/work/cases" }} />

      <Section title="What I build">
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <Card key={s.title} as="article" tone="surface" className="flex flex-col gap-4">
              <h3 className="text-h3 m-0">{s.title}</h3>
              <p className="text-body m-0">{s.body}</p>
              <Readout size="sm" accent={s.accent} label={s.judged.label} number={s.judged.number} unit={s.judged.unit} window={s.judged.window} />
            </Card>
          ))}
        </div>
      </Section>

      <Section title="How an engagement runs" lead="Four steps. The second one is the one most people skip.">
        <ol className="grid gap-6 md:grid-cols-4 m-0 p-0 list-none">
          {steps.map(([t, b], i) => (
            <li key={t} className="border-t-heavy border-ink pt-4 flex flex-col gap-2">
              <span className="text-small text-quiet tnum">{i + 1} of 4</span>
              <h3 className="text-h4 m-0">{t}</h3>
              <p className="text-body m-0">{b}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Receipts" aside={{ label: "All case studies", href: "#/work/cases" }}>
        <div className="grid gap-6 md:grid-cols-2">
          {cases.slice(0, 2).map((c) => (
            <CaseStudyCard key={c.slug} context={c.context} when={c.when} title={c.title} summary={c.summary} href={`#/work/cases/${c.slug}`} readout={{ accent: c.accent ?? "automation", label: c.metricLabel, number: `${c.before.value} → ${c.after.value}`, unit: c.unit, window: c.window }} />
          ))}
        </div>
      </Section>

      <Section title="Working terms">
        <Card tone="outline" className="max-w-measure">
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 m-0 text-body">
            <dt className="text-quiet">Engagement</dt><dd className="m-0">Retainer (monthly, a fixed number of days) or a scoped project.</dd>
            <dt className="text-quiet">Dates</dt><dd className="m-0">A range and a date I would bet on. If I would not bet on it, I do not say it.</dd>
            <dt className="text-quiet">Privacy</dt><dd className="m-0">Anonymised by default. Nothing about your company appears here without your written yes.</dd>
            <dt className="text-quiet">Code</dt><dd className="m-0">Yours. Repository, dashboards and docs are handed over at the readout.</dd>
          </dl>
        </Card>
      </Section>

      <CtaBand headline="Tell me what you do by hand, and what it costs." note="Thirty minutes, and I will say if it is not a fit." primary={{ label: "Book a scoping call", href: "#/contact" }} className="mt-16" />
    </>
  );
}
