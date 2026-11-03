import { Link } from "./Link";
import { ThemeToggle } from "./ThemeToggle";

export type FooterProps = {
  /** Groups of links: [{ title: "Work", links: [...] }, ...]. Three at most. */
  groups: { title: string; links: { label: string; href: string; external?: boolean }[] }[];
  line?: string;
  brand?: string;
  year?: number;
};

/**
 * Footer — heavy rule, wordmark and house line, up to three link groups, theme toggle, a plain copyright line.
 * No newsletter here (that is a CtaBand or ContactForm on the page); no social icons, text links instead.
 */
export function Footer({ groups, line = "I build AI software and show the numbers.", brand = "Boona", year = new Date().getFullYear() }: FooterProps) {
  return (
    <footer className="border-t-heavy border-ink mt-24">
      <div className="mx-auto max-w-container px-gutter py-12 grid gap-10 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
        <div className="flex flex-col gap-3">
          <span className="text-h3 font-bold tracking-tight">{brand}</span>
          <p className="m-0 text-body max-w-[32ch]">{line}</p>
        </div>
        {groups.slice(0, 3).map((g) => (
          <nav key={g.title} aria-label={g.title} className="flex flex-col gap-2">
            <span className="text-small font-medium">{g.title}</span>
            <ul className="m-0 p-0 list-none flex flex-col gap-2">
              {g.links.map((l) => (
                <li key={l.href}><Link href={l.href} external={l.external} className="text-small no-underline hover:underline">{l.label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto max-w-container px-gutter pb-10 flex flex-wrap items-center justify-between gap-4">
        <p className="m-0 text-caption text-quiet">© {year} Boopathi Thangamani. Client work on this site is anonymised.</p>
        <ThemeToggle variant="compact" />
      </div>
    </footer>
  );
}

export default Footer;
