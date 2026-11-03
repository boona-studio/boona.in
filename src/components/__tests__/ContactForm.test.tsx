import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "../ContactForm";

describe("ContactForm", () => {
  it("explains each problem instead of disabling submit", async () => {
    const onSubmit = vi.fn(async () => {});
    render(<ContactForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    const alerts = screen.getAllByRole("alert");
    expect(alerts).toHaveLength(3);
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid values and shows the honest success line", async () => {
    const onSubmit = vi.fn(async () => {});
    render(<ContactForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText("Name"), "Priya");
    await userEvent.type(screen.getByLabelText("Email"), "priya@example.com");
    await userEvent.type(screen.getByLabelText(/What are you trying/), "We spend about 18 hours a week matching invoices by hand.");
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: "Priya", email: "priya@example.com" }));
    expect(await screen.findByRole("status")).toHaveTextContent(/two working days/);
  });

  it("drops submissions where the honeypot is filled", async () => {
    const onSubmit = vi.fn(async () => {});
    const { container } = render(<ContactForm mode="newsletter" onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText("Email"), "bot@example.com");
    const honeypot = container.querySelector<HTMLInputElement>('input[name="company"]')!;
    await userEvent.type(honeypot, "Spam Inc");
    await userEvent.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows a recoverable error when sending fails", async () => {
    const onSubmit = vi.fn(async () => { throw new Error("network"); });
    render(<ContactForm mode="newsletter" onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText("Email"), "a@b.co");
    await userEvent.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/did not send/);
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeEnabled();
  });
});
