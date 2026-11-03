import type { AnchorHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Opens in a new tab and says so to assistive tech. */
  external?: boolean;
  /** "inline" sits in running text; "standalone" is a line on its own (slightly heavier). */
  tone?: "inline" | "standalone";
};

/**
 * Link — ink with an underline, never a colour. External links announce themselves; no arrow glyphs.
 */
export function Link({ external = false, tone = "inline", className, children, ...rest }: LinkProps) {
  return (
    <a
      className={cn(
        "text-link underline underline-offset-4 decoration-1 rounded-none",
        "hover:decoration-2 focus-visible:outline focus-visible:outline-heavy focus-visible:outline-focus focus-visible:outline-offset-focus-offset",
        tone === "standalone" && "font-medium",
        className
      )}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...rest}
    >
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

export default Link;
