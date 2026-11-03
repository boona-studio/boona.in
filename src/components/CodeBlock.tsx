import { useId, useState } from "react";
import { cn } from "../lib/cn";

export type CodeBlockProps = {
  code: string;
  /** "bash", "ts", "json"… shown in the title bar and set as a class for an optional highlighter. */
  language?: string;
  /** File name or command context: "deploy.yml", "$ terminal". */
  title?: string;
  lineNumbers?: boolean;
  /** Terminal tone: ink background in both themes, like the readout. Default is surface. */
  tone?: "surface" | "terminal";
  className?: string;
};

/**
 * CodeBlock — the one place the mono stack is allowed. Real <pre><code>, a copy button with a live announcement,
 * horizontal scroll on narrow screens, never a screenshot of code.
 */
export function CodeBlock({ code, language, title, lineNumbers = false, tone = "surface", className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const id = useId();
  const lines = code.replace(/\n$/, "").split("\n");
  const terminal = tone === "terminal";

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: the text is still selectable */
    }
  }

  return (
    <figure className={cn("m-0 rounded-sm overflow-hidden", terminal ? "bg-bar text-on-bar" : "bg-surface text-ink border-hairline border-line", className)}>
      <figcaption className={cn("flex items-center justify-between gap-4 px-4 h-control-md text-caption", terminal ? "text-quiet-on-bar border-b-hairline border-quiet" : "text-quiet border-b-hairline border-line")}>
        <span className="truncate">{title ?? language ?? "code"}</span>
        <button
          type="button"
          onClick={copy}
          className={cn(
            "h-touch -my-2 px-3 rounded-none text-caption font-medium",
            "focus-visible:outline focus-visible:outline-heavy focus-visible:outline-focus focus-visible:outline-offset-[-2px]",
            terminal ? "text-on-bar hover:bg-quiet" : "text-ink hover:bg-line"
          )}
          aria-describedby={id}
        >
          {copied ? "Copied" : "Copy"}
        </button>
        <span id={id} className="sr-only" aria-live="polite">{copied ? "Code copied to clipboard" : ""}</span>
      </figcaption>
      <pre className="m-0 p-4 overflow-x-auto text-code">
        <code className={language ? `language-${language}` : undefined}>
          {lineNumbers
            ? lines.map((l, i) => (
                <span key={i} className="grid grid-cols-[3ch_1fr] gap-x-4">
                  <span aria-hidden="true" className={cn("text-right tnum select-none", terminal ? "text-quiet-on-bar" : "text-quiet")}>{i + 1}</span>
                  <span>{l === "" ? " " : l}</span>
                </span>
              ))
            : code}
        </code>
      </pre>
    </figure>
  );
}

export default CodeBlock;
