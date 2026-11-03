import { render, screen } from "@testing-library/react";
import { CaseStudyCard } from "../CaseStudyCard";
import { ProductCard } from "../ProductCard";
import { Testimonial } from "../Testimonial";
import { CtaBand } from "../CtaBand";
import { Link } from "../Link";
import { Footer } from "../Footer";

describe("CaseStudyCard", () => {
  it("renders context, readout and the read link, as an article", () => {
    render(<CaseStudyCard context="six-person ops team" title="Invoice matching" summary="Pipeline flags exceptions." readout={{ label: "hours a week", number: "18 → 4", unit: "h", window: "over 4 weeks" }} href="/work/x" />);
    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByText("six-person ops team")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "hours a week: 18 → 4 h, over 4 weeks" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read the case" })).toHaveAttribute("href", "/work/x");
  });
});

describe("ProductCard", () => {
  it("shows pricing, what is missing, and both paths", () => {
    render(<ProductCard name="Azhagi" oneLine="An AI you can video-call." pricing={["SaaS", "Self-hosted"]} missing="Chrome only." accent="azhagi" readout={{ label: "camera to reply", number: "180", unit: "ms", window: "over 200 calls" }} href="/products/azhagi" />);
    expect(screen.getByText("SaaS · Self-hosted")).toBeInTheDocument();
    expect(screen.getByText("Chrome only.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Try Azhagi" })).toHaveAttribute("href", "/products/azhagi");
    expect(screen.getByRole("link", { name: "I can build this for you" })).toHaveAttribute("href", "/work");
  });
});

describe("Testimonial", () => {
  it("is a figure with a quote and anonymised attribution", () => {
    render(<Testimonial quote="Shipped on the date he gave." attribution="CTO, logistics, 120 people" />);
    expect(screen.getByRole("figure")).toBeInTheDocument();
    expect(screen.getByText("CTO, logistics, 120 people")).toBeInTheDocument();
  });
});

describe("CtaBand", () => {
  it("is a labelled region with at most two actions", () => {
    render(<CtaBand headline="Book a call." primary={{ label: "Book", href: "/contact" }} secondary={{ label: "See work", href: "/work" }} />);
    expect(screen.getByRole("region", { name: "Book a call." })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});

describe("Link", () => {
  it("announces external links and hardens them", () => {
    render(<Link href="https://x.com" external>X</Link>);
    const a = screen.getByRole("link", { name: "X (opens in a new tab)" });
    expect(a).toHaveAttribute("rel", "noopener noreferrer");
    expect(a).toHaveAttribute("target", "_blank");
  });
});

describe("Footer", () => {
  it("caps link groups at three and names each nav", () => {
    const g = (t: string) => ({ title: t, links: [{ label: t + " link", href: "/" + t }] });
    render(<Footer groups={[g("A"), g("B"), g("C"), g("D")]} year={2026} />);
    expect(screen.getAllByRole("navigation")).toHaveLength(3);
    expect(screen.getByRole("navigation", { name: "A" })).toBeInTheDocument();
    expect(screen.getByText(/© 2026/)).toBeInTheDocument();
  });
});
