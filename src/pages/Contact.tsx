import { ContactForm } from "../components/ContactForm";
import { Section } from "../components/Section";

const next = [
  ["I reply", "Within two working days, with a yes, a no, or a question."],
  ["We talk", "Thirty minutes. What you do by hand, what it costs, what a number would mean to you."],
  ["Baseline", "Two weeks of measuring the current number before anything is built."],
  ["Proposal", "Scope, a date range I would bet on, and the number we will judge it by."],
];

async function send(values: Record<string, string>) {
  // Replace with the form endpoint (Formspree, Resend, or an API route). Keep the honeypot and the success copy.
  await new Promise((r) => setTimeout(r, 400));
  if (!values.email) throw new Error("no email");
}

export function Contact() {
  return (
    <>
      <header className="mx-auto max-w-container px-gutter pt-16 pb-10 border-t-heavy border-ink flex flex-col gap-4">
        <h1 className="text-h1 m-0 max-w-[22ch]">Tell me what you are trying to get a number on.</h1>
        <p className="text-lead m-0 max-w-measure">I reply within two working days, and I will say if it is not a fit.</p>
      </header>
      <Section title="Write to me">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <ContactForm onSubmit={send} />
          <ol className="m-0 p-0 list-none flex flex-col">
            {next.map(([t, b], i) => (
              <li key={t} className="grid grid-cols-[3ch_1fr] gap-4 py-4 border-t-hairline border-line">
                <span className="text-h4 tnum text-quiet">{i + 1}</span>
                <div className="flex flex-col gap-1"><span className="text-h4">{t}</span><span className="text-body text-quiet">{b}</span></div>
              </li>
            ))}
          </ol>
        </div>
      </Section>
      <Section title="One email a week" lead="What I shipped, with the number. Unsubscribe in one click.">
        <ContactForm mode="newsletter" onSubmit={send} />
      </Section>
    </>
  );
}
