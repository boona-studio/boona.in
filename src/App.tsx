import { useEffect } from "react";
import { match, usePath, useRouteFocus, type Route } from "./app/router";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { site } from "./content/site";
import { Gallery } from "./dev/Gallery";
import { About } from "./pages/About";
import { CaseStudy, Cases } from "./pages/Cases";
import { Contact } from "./pages/Contact";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Product, Products } from "./pages/Products";
import { Work } from "./pages/Work";
import { Writing } from "./pages/Writing";

export const routes: Route[] = [
  { path: "/", title: "Boona — I build AI software and show the numbers", render: () => <Home /> },
  { path: "/work", title: "Work with me — Boona", render: () => <Work /> },
  { path: "/work/cases", title: "Case studies — Boona", render: () => <Cases /> },
  { path: "/work/cases/:slug", title: "Case study — Boona", render: (p) => <CaseStudy slug={p.slug} /> },
  { path: "/products", title: "Products — Boona", render: () => <Products /> },
  { path: "/products/:slug", title: "Product — Boona", render: (p) => <Product slug={p.slug} /> },
  { path: "/writing", title: "Writing — Boona", render: () => <Writing /> },
  { path: "/about", title: "About — Boona", render: () => <About /> },
  { path: "/contact", title: "Contact — Boona", render: () => <Contact /> },
  { path: "/gallery", title: "Component gallery — Boona", render: () => <Gallery /> },
];

export function App() {
  const path = usePath();
  const m = match(routes, path);
  useRouteFocus(path);
  useEffect(() => { document.title = m?.route.title ?? "Not found — Boona"; }, [m]);
  if (m?.route.path === "/gallery") return <Gallery />;
  const links = site.nav.map((l) => { const base = l.href.slice(1); return { ...l, current: path === base || path.startsWith(base + "/") }; });
  return (
    <>
      <Nav links={links} cta={site.cta} brand={site.name} brandHref="#/" />
      <main id="main" className="outline-none">{m ? m.route.render(m.params) : <NotFound />}</main>
      <Footer groups={site.footer.map((g) => ({ title: g.title, links: [...g.links] }))} line={site.houseLine} brand={site.name} />
    </>
  );
}

export default App;
