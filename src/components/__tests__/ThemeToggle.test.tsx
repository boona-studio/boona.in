import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "../ThemeToggle";

describe("ThemeToggle", () => {
  it("is a labelled radiogroup with three options, System selected by default", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("radiogroup", { name: "Theme" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "System" })).toHaveAttribute("aria-checked", "true");
  });

  it("applies and stores Dark, then clears it on System", async () => {
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole("radio", { name: "Dark" }));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(localStorage.getItem("boona-theme")).toBe("dark");
    expect(screen.getByRole("radio", { name: "Dark" })).toHaveAttribute("aria-checked", "true");

    await userEvent.click(screen.getByRole("radio", { name: "System" }));
    expect(document.documentElement).not.toHaveAttribute("data-theme");
    expect(localStorage.getItem("boona-theme")).toBeNull();
  });

  it("reads a stored choice on mount", () => {
    localStorage.setItem("boona-theme", "light");
    render(<ThemeToggle />);
    expect(screen.getByRole("radio", { name: "Light" })).toHaveAttribute("aria-checked", "true");
  });

  it("compact variant keeps accessible names without visible labels", () => {
    render(<ThemeToggle variant="compact" />);
    expect(screen.getByRole("radio", { name: "Dark" })).toBeInTheDocument();
    expect(screen.queryByText("Dark")).not.toBeInTheDocument();
  });
});
