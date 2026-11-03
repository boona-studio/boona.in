import { render, screen } from "@testing-library/react";
import { Readout } from "../Readout";

describe("Readout", () => {
  it("renders label, number, unit and window as one sentence for assistive tech", () => {
    render(<Readout label="camera to reply" number="180" unit="ms" window="over 200 calls" accent="azhagi" />);
    expect(screen.getByRole("group", { name: "camera to reply: 180 ms, over 200 calls" })).toBeInTheDocument();
    expect(screen.getByText("180")).toBeInTheDocument();
    expect(screen.getByText("over 200 calls")).toBeInTheDocument();
  });

  it("never shows a unit or window without a number", () => {
    render(<Readout label="Boopathi Thangamani" unit="ms" window="over 200 calls" />);
    expect(screen.getByRole("group", { name: "Boopathi Thangamani" })).toBeInTheDocument();
    expect(screen.queryByText("ms")).not.toBeInTheDocument();
    expect(screen.queryByText("over 200 calls")).not.toBeInTheDocument();
  });

  it("treats an empty-string number as no number", () => {
    render(<Readout label="x" number="   " unit="h" />);
    expect(screen.queryByText("h")).not.toBeInTheDocument();
  });

  it("becomes a link when href is given", () => {
    render(<Readout label="latest" number="4" unit="h" href="/work" />);
    expect(screen.getByRole("link", { name: "latest: 4 h" })).toHaveAttribute("href", "/work");
  });

  it("uses tabular numerals on the number", () => {
    render(<Readout label="x" number="4" />);
    expect(screen.getByText("4")).toHaveClass("tnum");
  });
});
