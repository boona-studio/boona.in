/**
 * Client work. There is deliberately no `client`, `company` or `logo` field on this type:
 * context describes the team, never the company. A test checks that.
 */
export type CaseStudy = {
  slug: string;
  context: string;
  when: string;
  title: string;
  summary: string;
  before: { value: number; note: string; story: string };
  after: { value: number; note: string; story: string };
  /** What the number measures, for the bar: "hours a week", "hours to go live". */
  metricLabel: string;
  unit: string;
  window: string;
  stillHuman: string;
  quote?: { text: string; attribution: string };
  accent?: "automation" | "azhagi" | "cue";
};

export const cases: CaseStudy[] = [
  {
    slug: "invoice-matching",
    context: "Six-person ops team, logistics, Chennai",
    when: "2026, four weeks",
    title: "Invoice matching, by hand to pipeline",
    summary: "Two people matched supplier invoices to purchase orders by hand. A pipeline now matches them and flags exceptions for review. About one in nine still needs a human, and that is the honest number.",
    before: { value: 18, note: "two people, by hand", story: "Every invoice was opened, read, and matched against a purchase order in a spreadsheet. Eighteen hours a week across two people, and a backlog every month end." },
    after: { value: 4, note: "reviewing flagged exceptions", story: "The pipeline reads the invoice, finds the order, and posts the match. Anything it is not sure about goes to one person with the reason attached. Telemetry went in before the first invoice did: match rate, exception count and review time per invoice, on one dashboard." },
    metricLabel: "hours a week",
    unit: "h",
    window: "over 4 weeks",
    stillHuman: "One in nine invoices is flagged for a person: duplicates, partial deliveries, and suppliers who change their layout. That ratio is on the dashboard and it is the first thing we check each week.",
    quote: { text: "He told us on day two which half of the plan would not ship on time. It was the right half.", attribution: "Operations lead, logistics, 40 people" },
    accent: "automation",
  },
  {
    slug: "store-onboarding",
    context: "Food-ordering platform, product team of eight",
    when: "2018, six weeks",
    title: "Store onboarding, 48 hours to 24",
    summary: "New restaurants took two days to go live because menu entry was manual. Automating the entry with a human check kept cut the time in half and removed the weekend backlog.",
    before: { value: 48, note: "manual menu entry", story: "A store sent its menu as a photo or a PDF. Someone typed it in, someone else checked it, and the store went live two days later if nothing was missing." },
    after: { value: 24, note: "entry automated, human check kept", story: "Menus are parsed on upload and a person checks the result instead of typing it. The check stayed on purpose: prices and allergens are not where to remove a human." },
    metricLabel: "hours to go live",
    unit: "h",
    window: "measured over 6 weeks",
    stillHuman: "The check. Every menu is read by a person before it is live, because a wrong price costs more than an hour.",
    accent: "automation",
  },
];

export const caseBySlug = (slug: string) => cases.find((c) => c.slug === slug);
