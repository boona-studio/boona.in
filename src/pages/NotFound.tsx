import { Link } from "../components/Link";

export function NotFound() {
  return (
    <header className="mx-auto max-w-container px-gutter pt-16 pb-16 border-t-heavy border-ink flex flex-col gap-4">
      <h1 className="text-h1 m-0">That page is not here.</h1>
      <p className="text-lead m-0 max-w-measure">The link may be old. Everything I have shipped is on the <Link href="#/products">products</Link> page, and the receipts are under <Link href="#/work/cases">case studies</Link>.</p>
    </header>
  );
}
