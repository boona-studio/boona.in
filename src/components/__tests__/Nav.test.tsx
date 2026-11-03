import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Nav } from "../Nav";

const links = [{ label: "Work", href: "/work", current: true }, { label: "About", href: "/about" }];

describe("Nav", () => {
  it("puts a skip link first and marks the current page", () => {
    render(<Nav links={links} />);
    expect(screen.getAllByRole("link")[0]).toHaveTextContent("Skip to content");
    expect(screen.getAllByRole("link", { name: "Work" })[0]).toHaveAttribute("aria-current", "page");
  });

  it("opens and closes the phone menu, including with Escape", async () => {
    render(<Nav links={links} />);
    const btn = screen.getByRole("button", { name: "Menu" });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(btn);
    expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById(btn.getAttribute("aria-controls")!)).not.toHaveAttribute("hidden");
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Menu" })).toHaveFocus();
  });

  it("has exactly one CTA label", () => {
    render(<Nav links={links} cta={{ label: "Book a call", href: "/contact" }} />);
    expect(screen.getAllByRole("link", { name: "Book a call" }).length).toBeGreaterThan(0);
  });
});
