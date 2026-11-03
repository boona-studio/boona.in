import { render, screen, within } from "@testing-library/react";
import { App, routes } from "../../App";
import { match } from "../../app/router";
import { cases } from "../../content/cases";
import { products } from "../../content/products";
import { Home } from "../Home";
import { Work } from "../Work";
import { CaseStudy } from "../Cases";
import { Product } from "../Products";
import { About } from "../About";
import { Contact } from "../Contact";

const BANNED = /\b(leverage|seamless|revolutionary|game-changing|unlock|10x|cutting-edge|supercharge|effortless)\b/i;
// The agency is not public: no "we build / we help / our team / we offer". "We measure" (me and the client) is fine.
const AGENCY_WE = /\b(we (build|help|offer|deliver|specialise|specialize|provide)|our (team|agency|clients|services))\b/i;

describe("content rules", () => {
  it("case studies have no client, company or logo field", () => {
    for (const c of cases) {
      expect(Object.keys(c)).not.toEqual(expect.arrayContaining(["client"]));
      expect(Object.keys(c)).not.toEqual(expect.arrayContaining(["company"]));
      expect(Object.keys(c)).not.toEqual(expect.arrayContaining(["logo"]));
      expect(c.window).toBeTruthy();
      expect(c.stillHuman).toBeTruthy();
    }
  });
  it("every product says what is missing and what it is judged by", () => {
    for (const p of products) {
      expect(p.missing.length).toBeGreaterThan(10);
      expect(p.metric.window).toBeTruthy();
    }
  });
});

describe("pages", () => {
  const pages: [string, React.ReactElement][] = [
    ["Home", <Home />],
    ["Work", <Work />],
    ["CaseStudy", <CaseStudy slug={cases[0].slug} />],
    ["Product", <Product slug={products[0].slug} />],
    ["About", <About />],
    ["Contact", <Contact />],
  ];
  for (const [name, el] of pages) {
    it(`${name}: one h1, no hype words, first person`, () => {
      const { container } = render(el);
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      expect(container.textContent).not.toMatch(BANNED);
      expect(container.textContent).not.toMatch(AGENCY_WE);
    });
  }
  it("Home has exactly one CTA band and a readout above the fold", () => {
    render(<Home />);
    expect(screen.getAllByRole("region").filter((r) => within(r).queryByRole("link", { name: /book a scoping call/i }))).toHaveLength(1);
    expect(screen.getAllByRole("link", { name: /Azhagi, latest/ })[0]).toBeInTheDocument();
  });
  it("Product page shows the Not yet line and the build-for-you path", () => {
    render(<Product slug="azhagi" />);
    expect(screen.getByText(products[0].missing)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "I can build this for you." })).toBeInTheDocument();
  });
  it("unknown slugs render Not found", () => {
    render(<Product slug="nope" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/not here/);
  });
});

describe("router", () => {
  it("matches static and param routes", () => {
    expect(match(routes, "/")?.route.path).toBe("/");
    expect(match(routes, "/work/cases/invoice-matching")?.params.slug).toBe("invoice-matching");
    expect(match(routes, "/products/azhagi")?.params.slug).toBe("azhagi");
    expect(match(routes, "/nothing/here/at/all")).toBeNull();
  });
  it("renders the app shell with nav, main and footer", () => {
    window.location.hash = "#/about";
    render(<App />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(document.title).toMatch(/About/);
    window.location.hash = "";
  });
});
