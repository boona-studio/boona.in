import type { ReadoutAccent } from "../components/Readout";
import type { PricingModel } from "../components/ProductCard";

export type Product = {
  slug: string;
  name: string;
  version: string;
  oneLine: string;
  audience: string;
  pricing: PricingModel[];
  /** Required. A product entry without an honest line is off-brand. */
  missing: string;
  accent: Exclude<ReadoutAccent, "lost" | "none">;
  metric: { label: string; number: string; unit: string; window: string };
  /** Which hero device the product page uses. */
  hero: "call" | "timeline" | "plain";
  /** Three short paragraphs: for whom, what happens, what it does not do yet. */
  about: [string, string, string];
  href: string;
  docsHref?: string;
};

export const products: Product[] = [
  {
    slug: "azhagi",
    name: "Azhagi",
    version: "0.3",
    oneLine: "An AI you can video-call. She sees you through the camera, talks back in real time, and moves with a face and body built in Unreal Engine.",
    audience: "businesses that want a front-desk or coaching presence, and people who want a presence rather than a chat box",
    pricing: ["SaaS", "Self-hosted", "Pay as you use"],
    missing: "Self-hosting is not ready yet; works in Chrome only.",
    accent: "azhagi",
    metric: { label: "camera to reply", number: "[N]", unit: "ms", window: "over [n] calls" },
    hero: "call",
    about: [
      "For a business, Azhagi is a front desk that never looks at a script: she greets, answers, and hands over to a person when she should. For a coach, she is a practice partner who reacts to your face, not just your words.",
      "You open a link, allow the camera, and talk. Azhagi listens and watches, answers out loud, and moves on cue because Boona Cue is underneath turning words into exact motion.",
      "Not yet: self-hosting, languages other than English and Tamil, and any browser other than Chrome.",
    ],
    href: "#/products/azhagi",
  },
  {
    slug: "cue",
    name: "Boona Cue",
    version: "0.2",
    oneLine: "Say “blink twice, nod three times” and it becomes exact movement for any AI or 3D character.",
    audience: "developers and studios building characters",
    pricing: ["Developer licence"],
    missing: "Unreal Engine only for now; Unity export is next.",
    accent: "cue",
    metric: { label: "cues landed as written", number: "[N]", unit: "%", window: "over [n] prompts" },
    hero: "timeline",
    about: [
      "For a developer, Cue is the layer between a language model and a rig: it takes plain words and returns timed, exact motion your character can play.",
      "You send a sentence; Cue returns keyframes with timing. Blink twice is two blinks, not a shrug. The same engine moves Azhagi.",
      "Not yet: Unity export, and facial capture as an input.",
    ],
    href: "#/products/cue",
    docsHref: "#/products/cue",
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
