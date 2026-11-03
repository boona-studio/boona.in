import { useEffect, useId, useRef, useState } from "react";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "../lib/cn";

export type NavLink = { label: string; href: string; current?: boolean };

export type NavProps = {
  links: NavLink[];
  /** The one CTA. Defaults to "Work with me" → /contact. */
  cta?: { label: string; href: string };
  /** Wordmark text; plain type, no logo file needed. */
  brand?: string;
  brandHref?: string;
  className?: string;
};

/**
 * Nav — sticky, hairline bottom edge (elevation.1), wordmark left, links centre, theme toggle and one CTA right.
 * Under 768px the links collapse behind a real <button aria-expanded>; Escape closes it.
 * Ships with a skip link as the first focusable element on the page.
 */
export function Nav({ links, cta = { label: "Work with me", href: "/contact" }, brand = "Boona", brandHref = "/", className }: NavProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btnRef.current?.focus(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const linkClass = (current?: boolean) =>
    cn(
      "inline-flex items-center h-touch px-3 text-small font-medium rounded-none",
      "focus-visible:outline focus-visible:outline-heavy focus-visible:outline-focus focus-visible:outline-offset-[-2px]",
      current ? "underline underline-offset-8 decoration-2" : "hover:underline hover:underline-offset-8"
    );

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-toast focus:bg-ink focus:text-on-ink focus:px-4 focus:py-2">
        Skip to content
      </a>
      <header className={cn("sticky top-0 z-sticky bg-ground shadow-1", className)}>
        <nav aria-label="Main" className="mx-auto max-w-container px-gutter h-16 flex items-center gap-4">
          <a href={brandHref} className="text-h4 font-bold tracking-tight mr-auto rounded-none focus-visible:outline focus-visible:outline-heavy focus-visible:outline-focus focus-visible:outline-offset-focus-offset">
            {brand}
          </a>

          <ul className="hidden md:flex items-center gap-1 m-0 p-0 list-none">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} aria-current={l.current ? "page" : undefined} className={linkClass(l.current)}>{l.label}</a>
              </li>
            ))}
          </ul>

          <div className="hidden md:block"><ThemeToggle variant="compact" /></div>
          <Button href={cta.href} size="md" className="hidden md:inline-flex">{cta.label}</Button>

          <button
            ref={btnRef}
            type="button"
            className={cn("md:hidden inline-flex items-center justify-center h-touch min-w-touch rounded-none border-rule border-ink text-small font-medium", "focus-visible:outline focus-visible:outline-heavy focus-visible:outline-focus focus-visible:outline-offset-focus-offset")}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>

        <div id={menuId} hidden={!open} className="md:hidden border-t-hairline border-line bg-ground">
          <ul className="m-0 p-gutter list-none flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} aria-current={l.current ? "page" : undefined} className={cn(linkClass(l.current), "w-full")}>{l.label}</a>
              </li>
            ))}
            <li className="pt-3 flex flex-col gap-3">
              <ThemeToggle />
              <Button href={cta.href} size="lg">{cta.label}</Button>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}

export default Nav;
