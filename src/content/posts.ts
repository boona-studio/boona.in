export type Post = { slug: string; title: string; oneLine: string; date: string; mode: "Broad" | "Nurture" | "Convert" };

export const posts: Post[] = [
  { slug: "demo-vs-weeks", title: "Most AI automation demos are measured in minutes. The useful ones are measured in weeks.", oneLine: "Why I ask for a two-week baseline before I quote.", date: "2026-10-28", mode: "Broad" },
  { slug: "telemetry-before-users", title: "Ship the dashboard before the first user.", oneLine: "The three numbers I put on one screen before launch, and why logging is not telemetry.", date: "2026-10-21", mode: "Nurture" },
  { slug: "invoice-matching-readout", title: "18 hours a week, by hand, to four.", oneLine: "What changed for a six-person ops team, and the one in nine that still needs a person.", date: "2026-10-14", mode: "Convert" },
];
