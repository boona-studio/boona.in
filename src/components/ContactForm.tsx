import { useId, useState, type FormEvent } from "react";
import { Button } from "./Button";
import { cn } from "../lib/cn";

export type ContactFormProps = {
  /** "contact" = name, email, message. "newsletter" = email only. */
  mode?: "contact" | "newsletter";
  /** Called with the values; resolve to succeed, throw to show an error. */
  onSubmit: (values: Record<string, string>) => Promise<void>;
  /** Shown after success. Plain, first person. */
  successText?: string;
  className?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-small font-medium">{label}</label>
      {hint && <span id={`${id}-hint`} className="text-caption text-quiet">{hint}</span>}
      {children}
      {error && <span id={`${id}-error`} className="text-caption text-error" role="alert">{error}</span>}
    </div>
  );
}

const INPUT = cn(
  "w-full h-control-md px-3 rounded-xs bg-ground text-ink border-rule border-line text-body",
  "placeholder:text-quiet",
  "focus-visible:outline focus-visible:outline-heavy focus-visible:outline-focus focus-visible:outline-offset-focus-offset",
  "aria-[invalid=true]:border-error"
);

/**
 * ContactForm — labels above fields, errors under them, one honest success line. No placeholder-as-label,
 * no disabled submit (errors are explained instead), a honeypot instead of a captcha.
 */
export function ContactForm({ mode = "contact", onSubmit, successText, className }: ContactFormProps) {
  const id = useId();
  const [values, setValues] = useState<Record<string, string>>({ name: "", email: "", message: "", company: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues((v) => ({ ...v, [k]: e.target.value }));

  function validate() {
    const e: Record<string, string> = {};
    if (mode === "contact" && !values.name.trim()) e.name = "Add your name so I know who I am replying to.";
    if (!EMAIL.test(values.email)) e.email = "That email does not look right. Check for a typo.";
    if (mode === "contact" && values.message.trim().length < 20) e.message = "A sentence or two about the problem helps me reply with something useful.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    if (values.company) return; // honeypot filled: a bot
    if (!validate()) return;
    setStatus("sending");
    try {
      await onSubmit(values);
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <p role="status" className={cn("text-lead border-t-heavy border-ink pt-4 max-w-measure", className)}>
        {successText ?? (mode === "contact" ? "Got it. I reply within two working days, and I will say if it is not a fit." : "You are on the list. One email a week, a number in every one.")}
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className={cn("flex flex-col gap-5 max-w-measure", className)}>
      {mode === "contact" && (
        <Field id={`${id}-name`} label="Name" error={errors.name}>
          <input id={`${id}-name`} name="name" autoComplete="name" className={INPUT} value={values.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-error` : undefined} />
        </Field>
      )}
      <Field id={`${id}-email`} label="Email" error={errors.email}>
        <input id={`${id}-email`} name="email" type="email" inputMode="email" autoComplete="email" className={INPUT} value={values.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-error` : undefined} />
      </Field>
      {mode === "contact" && (
        <Field id={`${id}-message`} label="What are you trying to get a number on?" hint="The workflow, the team size, and what it costs you today, if you know it." error={errors.message}>
          <textarea id={`${id}-message`} name="message" rows={5} className={cn(INPUT, "h-auto py-3")} value={values.message} onChange={set("message")} aria-invalid={!!errors.message} aria-describedby={cn(`${id}-message-hint`, errors.message && `${id}-message-error`)} />
        </Field>
      )}
      {/* honeypot: hidden from people, visible to bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set("company")} />
      </div>
      {status === "failed" && (
        <p role="alert" className="m-0 text-small text-error">That did not send. Try again, or email me at hello@boona.in.</p>
      )}
      <div className="flex items-center gap-4">
        <Button type="submit" size="lg" loading={status === "sending"}>{mode === "contact" ? "Send" : "Subscribe"}</Button>
        <span className="text-caption text-quiet">{mode === "contact" ? "I reply within two working days." : "One email a week. Unsubscribe in one click."}</span>
      </div>
    </form>
  );
}

export default ContactForm;
