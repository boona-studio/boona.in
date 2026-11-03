export type Scar = { years: string; setup: string; happened: string; number?: string; rule: string; now: string };

export const scars: Scar[] = [
  {
    years: "2018–22",
    setup: "I set targets to please the room, not the work.",
    happened: "Dates slipped, repeatedly. The team paid for my estimate, and the people waiting on us stopped believing the next one.",
    rule: "Promise only realistic targets and deadlines.",
    now: "Every estimate I give has a range and a date I would bet on. If I would not bet on it, I do not say it.",
  },
  {
    years: "2022–25",
    setup: "We shipped a service to production with logging but no telemetry.",
    happened: "It went down. We had no numbers to tell us where, so we guessed for hours while customers waited.",
    rule: "Build the telemetry before you need it.",
    now: "Every project ships with a dashboard before the first user. Three numbers you would check at 3 a.m., on one screen.",
  },
];

export const rules = [
  { rule: "Promise only realistic targets and deadlines.", from: "Scar 1, 2018–22" },
  { rule: "Build the telemetry before you need it.", from: "Scar 2, 2022–25" },
  { rule: "Judge it by the number, not the demo.", from: "Every engagement since" },
];
