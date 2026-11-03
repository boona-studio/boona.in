import { Hero } from "../components/Hero";
import { Link } from "../components/Link";
import { Section } from "../components/Section";
import { posts } from "../content/posts";

export function Writing() {
  return (
    <>
      <Hero size="page" title="Writing." lead="One idea per post. Broad is an opinion, Nurture is a lesson, Convert has a number." />
      <Section title="Posts">
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
    </>
  );
}
