import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeBlock } from "../CodeBlock";

describe("CodeBlock", () => {
  it("renders real pre/code and the title", () => {
    render(<CodeBlock title="deploy.yml" language="yaml" code={"a: 1\nb: 2"} />);
    expect(screen.getByText("deploy.yml")).toBeInTheDocument();
    expect(document.querySelector("pre > code.language-yaml")).toBeInTheDocument();
  });

  it("copies the code and announces it", async () => {
    const writeText = vi.fn(async () => {});
    Object.assign(navigator, { clipboard: { writeText } });
    render(<CodeBlock code={"echo hi"} />);
    await userEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledWith("echo hi");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(screen.getByText("Code copied to clipboard")).toBeInTheDocument();
  });

  it("numbers lines without exposing the numbers to screen readers", () => {
    render(<CodeBlock lineNumbers code={"one\ntwo"} />);
    const nums = document.querySelectorAll('pre [aria-hidden="true"]');
    expect(nums).toHaveLength(2);
    expect(nums[1]).toHaveTextContent("2");
  });
});
