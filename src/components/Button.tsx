import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "quiet";
export type ButtonSize = "md" | "lg";

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a text "Working…" state and blocks clicks. */
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
};
type AsButton = Common & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;
type AsLink = Common & { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>;
export type ButtonProps = AsButton | AsLink;

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-ink text-on-ink border-rule border-ink hover:bg-quiet hover:border-quiet",
  secondary: "bg-ground text-ink border-rule border-ink hover:bg-surface",
  quiet: "bg-transparent text-ink border-rule border-transparent underline underline-offset-4 hover:bg-surface",
};
const SIZE: Record<ButtonSize, string> = {
  md: "h-control-md px-5 text-small",
  lg: "h-control-lg px-6 text-body",
};

/**
 * Button — square, ink. The label says what happens ("Book a scoping call", "Save changes"). No arrows, no icons by default.
 * Renders an <a> when `href` is given so a link looks like a button without stealing keyboard semantics.
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(props, ref) {
  const { variant = "primary", size = "md", loading = false, className, children, ...rest } = props as Common & Record<string, unknown>;
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-none font-medium whitespace-nowrap select-none",
    "transition-colors duration-fast ease-standard",
    "focus-visible:outline focus-visible:outline-heavy focus-visible:outline-focus focus-visible:outline-offset-focus-offset",
    "disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed",
    VARIANT[variant],
    SIZE[size],
    className
  );

  if ("href" in props && props.href) {
    const { href, ...a } = rest as unknown as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes} aria-disabled={loading || undefined} {...a}>
        {loading ? "Working…" : children}
      </a>
    );
  }
  const b = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} type={b.type ?? "button"} className={classes} disabled={b.disabled || loading} aria-busy={loading || undefined} {...b}>
      {loading ? "Working…" : children}
    </button>
  );
});

export default Button;
