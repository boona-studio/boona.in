import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type CardProps = HTMLAttributes<HTMLElement> & {
  /** "surface" is one step off the ground; "outline" is ground with a line; "ground" has no box at all (rule above). */
  tone?: "surface" | "outline" | "ground";
  /** Semantic element. Use "article" for cases and products, "section" for groups. */
  as?: "div" | "article" | "section" | "li";
  padding?: "none" | "md" | "lg";
};

/**
 * Card — a flat container. No shadow; depth comes from the bar and layering. Radius 4px (radius.sm).
 */
export function Card({ tone = "surface", as: Tag = "div", padding = "md", className, children, ...rest }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-sm min-w-0",
        tone === "surface" && "bg-surface",
        tone === "outline" && "bg-ground border-hairline border-line",
        tone === "ground" && "bg-ground border-t-heavy border-ink rounded-none",
        padding === "md" && "p-6",
        padding === "lg" && "p-8",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Card;
