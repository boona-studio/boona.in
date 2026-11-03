/**
 * Component gallery. Renders every component with real-shaped sample data. Used by `npm run dev` for hand checks and
 * by `npm run verify` for screenshots in both themes and two widths. Not shipped to boona.in.
 */
import { BeforeAfter } from "../components/BeforeAfter";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CaseStudyCard } from "../components/CaseStudyCard";
import { CodeBlock } from "../components/CodeBlock";
import { ContactForm } from "../components/ContactForm";
import { CtaBand } from "../components/CtaBand";
import { Footer } from "../components/Footer";
import { Link } from "../components/Link";
import { Nav } from "../components/Nav";
import { ProductCard } from "../components/ProductCard";
import { Readout } from "../components/Readout";
import { Testimonial } from "../components/Testimonial";
import { ThemeToggle } from "../components/ThemeToggle";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="flex flex-col gap-6 py-12 border-t-hairline border-line">
      <h2 id={`${id}-h`} className="text-h2 m-0">{title}</h2>
      {children}
    </section>
  );
}

export function Gallery() {
  return (
    <>
      <Nav
        links={[
          { label: "Work", href: "/work" },
          { label: "Products", href: "/products", current: true },
          { label: "Writing", href: "/writing" },
          { label: "About", href: "/about" },
        ]}
      />
      <main id="main" className="mx-auto max-w-container px-gutter">
        <section className="py-16 flex flex-col gap-6">
          <h1 className="text-hero m-0 max-w-[14ch]">I build AI software and show the numbers.</h1>
          <p className="text-lead m-0 max-w-measure">Boopathi Thangamani. Ten years shipping web apps and the pipelines behind them. Now AI products like Azhagi, and AI solutions for businesses.</p>
          <div className="flex flex-wrap gap-4">
            <Button href="/contact" size="lg">Work with me</Button>
            <Link href="/work" tone="standalone">See the readouts</Link>
          </div>
        </section>

        <Section id="readout" title="Readout">
          <Readout size="lg" accent="azhagi" label="Azhagi, latest" number="[latency]" unit="ms" window="over [n] calls" trailing="boona.in" />
          <Readout size="md" accent="automation" label="invoice matching, by hand" number="18 h → [N] h" unit="a week" window="measured over 4 weeks" />
          <Readout size="sm" accent="lost" label="Build the telemetry before you need it" trailing="2022–25" />
          <Readout size="sm" accent="none" label="Boopathi Thangamani" trailing="boona.in" href="/" />
        </Section>

        <Section id="buttons" title="Button and Link">
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg">Book a scoping call</Button>
            <Button variant="secondary" size="lg">See the receipts</Button>
            <Button variant="quiet">Read the log</Button>
            <Button loading>Send</Button>
            <Button disabled>Disabled</Button>
            <Button href="/work" variant="secondary">As a link</Button>
          </div>
          <p className="text-body m-0 max-w-measure">
            Links sit in text as <Link href="/work">ink with an underline</Link>, and external ones <Link href="https://example.com" external>say so</Link>.
          </p>
          <ThemeToggle />
        </Section>

        <Section id="cards" title="Card, case study, product">
          <div className="grid gap-6 md:grid-cols-2">
            <CaseStudyCard
              context="Six-person ops team, logistics, Chennai"
              when="2026, four weeks"
              title="Invoice matching, by hand to pipeline"
              summary="Two people matched invoices by hand. A pipeline now matches them and flags exceptions for review. About one in nine still needs a human, and that is the honest number."
              readout={{ label: "hours a week", number: "18 → [N]", unit: "h", window: "over 4 weeks" }}
              href="/work/invoice-matching"
            />
            <ProductCard
              name="Azhagi"
              version="0.3"
              oneLine="An AI you can video-call. She sees you, talks back in real time, and moves with a face and body built in Unreal Engine."
              audience="businesses that want a front-desk or coaching presence"
              pricing={["SaaS", "Self-hosted", "Pay as you use"]}
              missing="Self-hosting is not ready; works in Chrome only."
              accent="azhagi"
              readout={{ label: "camera to reply", number: "[latency]", unit: "ms", window: "over [n] calls" }}
              href="/products/azhagi"
            />
          </div>
          <Card tone="ground" padding="none" className="pt-4">
            <p className="text-body m-0 max-w-measure">A ground card is a rule and nothing else. Use it for lists.</p>
          </Card>
        </Section>

        <Section id="proof" title="Before and after, testimonial">
          <div className="grid gap-10 md:grid-cols-2">
            <BeforeAfter label="Hours a week on invoice matching" before={{ value: 18, note: "two people, by hand" }} after={{ value: 4, note: "reviewing flagged exceptions" }} unit="h" window="over 4 weeks" />
            <Testimonial
              quote="He told us on day two which half of the plan would not ship on time. It was the right half."
              attribution="Head of engineering, fintech, 40 people"
              readout={{ accent: "automation", label: "delivery dates hit", number: "5 of 5", window: "over 6 months" }}
            />
          </div>
        </Section>

        <Section id="code" title="Code block">
          <div className="grid gap-6 md:grid-cols-2">
            <CodeBlock title="deploy.yml" language="yaml" lineNumbers code={`steps:\n  - run: npm run check\n  - run: npm run tokens\n  - run: vite build`} />
            <CodeBlock tone="terminal" title="$ terminal" language="bash" code={`$ boona deploy --env prod\ntelemetry: on\nrollback caught in 4m 12s`} />
          </div>
        </Section>

        <Section id="form" title="Contact and newsletter">
          <div className="grid gap-10 md:grid-cols-2">
            <ContactForm onSubmit={async () => { await new Promise((r) => setTimeout(r, 300)); }} />
            <ContactForm mode="newsletter" onSubmit={async () => {}} />
          </div>
        </Section>
      </main>

      <CtaBand headline="If you want a number like this for your team, book a 30-minute call." note="I will tell you if it is not a fit." primary={{ label: "Book a scoping call", href: "/contact" }} secondary={{ label: "See the readouts", href: "/work" }} className="mt-16" />

      <Footer
        groups={[
          { title: "Work", links: [{ label: "Case studies", href: "/work" }, { label: "Services", href: "/services" }] },
          { title: "Products", links: [{ label: "Azhagi", href: "/products/azhagi" }, { label: "Boona Cue", href: "/products/cue" }] },
          { title: "Elsewhere", links: [{ label: "LinkedIn", href: "https://linkedin.com", external: true }, { label: "YouTube", href: "https://youtube.com", external: true }, { label: "X", href: "https://x.com", external: true }] },
        ]}
      />
    </>
  );
}
