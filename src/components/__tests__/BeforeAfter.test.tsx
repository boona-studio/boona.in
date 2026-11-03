import { render, screen } from "@testing-library/react";
import { BeforeAfter } from "../BeforeAfter";

describe("BeforeAfter", () => {
  it("describes the comparison in one sentence and shows the delta", () => {
    render(<BeforeAfter label="Hours a week" before={{ value: 18 }} after={{ value: 4 }} unit="h" window="over 4 weeks" />);
    expect(screen.getByRole("figure", { name: "Hours a week: before 18 h, after 4 h, over 4 weeks" })).toBeInTheDocument();
    expect(screen.getByText("-78%")).toBeInTheDocument();
  });

  it("does not dress up a regression", () => {
    render(<BeforeAfter label="Hours a week" before={{ value: 4 }} after={{ value: 6 }} unit="h" window="over 4 weeks" />);
    expect(screen.getByText("+50% (worse)")).toBeInTheDocument();
    const bars = document.querySelectorAll('[role="presentation"] > div');
    expect(bars[1]).toHaveClass("bg-ink");
  });

  it("gives the accent only to an improved after-bar", () => {
    render(<BeforeAfter label="x" before={{ value: 18 }} after={{ value: 4 }} unit="h" window="w" accent="azhagi" />);
    const bars = document.querySelectorAll('[role="presentation"] > div');
    expect(bars[1]).toHaveClass("bg-product-azhagi-accent");
  });
});
