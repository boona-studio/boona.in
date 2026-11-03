export const site = {
  name: "Boona",
  owner: "Boopathi Thangamani",
  houseLine: "I build AI software and show the numbers.",
  whoLine: "Boopathi Thangamani. Ten years shipping web apps and the pipelines behind them. Now AI products like Azhagi, and AI solutions for businesses.",
  belief: "Anyone selling or buying AI automation should judge it by hours saved per week, not by the demo.",
  cta: { label: "Work with me", href: "#/contact" },
  nav: [
    { label: "Work", href: "#/work" },
    { label: "Products", href: "#/products" },
    { label: "Writing", href: "#/writing" },
    { label: "About", href: "#/about" },
  ],
  footer: [
    { title: "Work", links: [{ label: "Services", href: "#/work" }, { label: "Case studies", href: "#/work/cases" }, { label: "Contact", href: "#/contact" }] },
    { title: "Products", links: [{ label: "Azhagi", href: "#/products/azhagi" }, { label: "Boona Cue", href: "#/products/cue" }] },
    { title: "Elsewhere", links: [{ label: "LinkedIn", href: "https://www.linkedin.com/", external: true }, { label: "YouTube", href: "https://www.youtube.com/", external: true }, { label: "X", href: "https://x.com/", external: true }] },
  ],
  photos: { cutout: "/assets/founder-cutout.png", portrait: "/assets/founder-portrait-4x5.jpg", camera: "/assets/founder-camera-16x9.jpg" },
} as const;
