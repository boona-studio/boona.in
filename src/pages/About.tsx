import { CtaBand } from "../components/CtaBand";
import { Link } from "../components/Link";
import { Readout } from "../components/Readout";
import { Section } from "../components/Section";
import { rules, scars } from "../content/scars";
import { site } from "../content/site";

export function About() {
  return (
    <>
      <header className="mx-auto max-w-container px-gutter pt-16 pb-10 border-t-heavy border-ink grid gap-8 md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-6">
          <h1 className="text-h1 m-0 max-w-[22ch]">Ten years shipping. Two scars I tell on purpose.</h1>
          <p className="text-lead m-0 max-w-measure">{site.whoLine} I build in public under the name Boona, and I show the numbers because the demos never did.</p>
        </div>
        <img src={site.photos.portrait} alt="Boopathi Thangamani" className="w-full max-w-[320px] h-auto rounded-sm justify-self-start md:justify-self-end" />
      </header>

      {scars.map((s, i) => (
        <Section key={s.years} title={`Scar ${i + 1}, ${s.years}`}>
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <dl className="m-0 flex flex-col gap-4 text-body max-w-measure">
              <div><dt className="text-small text-quiet">Setup</dt><dd className="m-0">{s.setup}</dd></div>
              <div><dt className="text-small text-quiet">What happened</dt><dd className="m-0">{s.happened}</dd></div>
              <div><dt className="text-small text-quiet">Where it shows up now</dt><dd className="m-0">{s.now}</dd></div>
            </dl>
            <div className="flex flex-col gap-4">
              <Readout size="md" accent="lost" label={s.rule} number={s.number} trailing={s.years} />
              <p className="text-small text-quiet m-0">A scar readout carries the rule, not a number, unless the cost was measured.</p>
            </div>
          </div>
        </Section>
      ))}

      <Section title="The rules">
        <ol className="m-0 p-0 list-none flex flex-col max-w-measure">
          {rules.map((r, i) => (
            <li key={r.rule} className="grid grid-cols-[3ch_1fr] gap-4 py-4 border-t-hairline border-line">
              <span className="text-h4 tnum text-quiet">{i + 1}</span>
              <div className="flex flex-col gap-1"><span className="text-h4">{r.rule}</span><span className="text-small text-quiet">{r.from}</span></div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Now">
        <p className="text-body m-0 max-w-measure">I am building <Link href="#/products/azhagi">Azhagi</Link> and <Link href="#/products/cue">Boona Cue</Link>, and I take on <Link href="#/work">client work</Link> where the result can be measured. I post what I ship, with the number, every week.</p>
      </Section>

      <CtaBand headline="If any of this sounds like your team, let's talk." note="Thirty minutes, and I will say if it is not a fit." primary={{ label: "Book a scoping call", href: "#/contact" }} className="mt-16" />
    </>
  );
}
