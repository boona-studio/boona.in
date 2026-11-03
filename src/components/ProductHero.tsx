import type { Product } from "../content/products";
import { Readout } from "./Readout";
import { cn } from "../lib/cn";

/**
 * ProductHero — the per-product hero device. Azhagi gets the call frame (two tiles, readout bar as the call's
 * readout); Cue gets the timeline strip; anything else gets name + one line + render slot.
 * New products choose one of the three in content; nothing here is product-specific beyond that choice.
 */
export function ProductHero({ product, cameraSrc }: { product: Product; cameraSrc?: string }) {
  const m = product.metric;
  if (product.hero === "call") {
    return (
      <div className="bg-bar text-on-bar rounded-none">
        <div className="flex items-center justify-between px-5 h-control-md text-small">
          <span className="flex items-center gap-2"><span aria-hidden="true" className="w-[10px] h-[10px] bg-product-azhagi-accent" /><span className="font-medium">Live</span><span className="text-quiet-on-bar tnum">00:04:22</span></span>
          <span className="text-quiet-on-bar">reply <span className="text-on-bar font-semibold tnum">{m.number} {m.unit}</span></span>
        </div>
        <div className="grid grid-cols-2 gap-2 px-2">
          <div className="relative aspect-video bg-surface text-quiet flex items-center justify-center text-small overflow-hidden">
            {cameraSrc ? <img src={cameraSrc} alt="Boopathi on a call" className="absolute inset-0 w-full h-full object-cover" /> : <span>You</span>}
            <span className="absolute left-3 bottom-3 px-2 py-1 bg-bar text-on-bar text-caption">Boopathi</span>
          </div>
          <div className="relative aspect-video bg-surface text-quiet flex items-center justify-center text-small">
            <span>[Azhagi render]</span>
            <span className="absolute left-3 bottom-3 px-2 py-1 bg-product-azhagi-accent text-bar text-caption font-medium">Azhagi</span>
            <span className="absolute right-3 top-3 px-2 py-1 border-rule border-product-cue-accent text-product-cue-accent text-caption">cue: nod ×3</span>
          </div>
        </div>
        <Readout size="md" accent="azhagi" label={m.label} number={m.number} unit={m.unit} window={m.window} />
      </div>
    );
  }
  if (product.hero === "timeline") {
    const cues = [
      { l: 8, w: 14, t: "blink ×2", fill: true },
      { l: 26, w: 30, t: "nod ×3", fill: true },
      { l: 60, w: 18, t: "look left", fill: false },
      { l: 82, w: 18, t: `${m.number} ${m.unit}`, fill: false },
    ];
    return (
      <div className="flex flex-col gap-0">
        <div className="flex justify-between text-caption text-quiet px-2 pb-2 border-b-rule border-ink tnum"><span>0 s</span><span>2 s</span><span>4 s</span><span>6 s</span><span>8 s</span><span>10 s</span></div>
        <div className="relative h-20 bg-surface border-b-rule border-line">
          {cues.map((c) => (
            <span key={c.t} className={cn("absolute top-3 bottom-3 flex items-center px-3 text-small font-medium whitespace-nowrap", c.fill ? "bg-product-cue-accent text-bar" : "border-rule border-product-cue-ink text-product-cue-ink")} style={{ left: `${c.l}%`, width: `${c.w}%` }}>{c.t}</span>
          ))}
          <span aria-hidden="true" className="absolute top-0 bottom-0 w-[2px] bg-ink" style={{ left: "62%" }} />
        </div>
        <Readout size="md" accent="cue" label={m.label} number={m.number} unit={m.unit} window={m.window} />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-video bg-surface text-quiet flex items-center justify-center text-small">[product render]</div>
      <Readout size="md" accent={product.accent} label={m.label} number={m.number} unit={m.unit} window={m.window} />
    </div>
  );
}

export default ProductHero;
