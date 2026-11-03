import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

describe("Button", () => {
  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "button");
  });

  it("renders an anchor when href is given", () => {
    render(<Button href="/contact">Work with me</Button>);
    expect(screen.getByRole("link", { name: "Work with me" })).toHaveAttribute("href", "/contact");
  });

  it("blocks clicks and announces busy while loading", async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Send</Button>);
    const b = screen.getByRole("button");
    expect(b).toBeDisabled();
    expect(b).toHaveAttribute("aria-busy", "true");
    expect(b).toHaveTextContent("Working…");
    await userEvent.click(b);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("calls onClick when enabled", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
