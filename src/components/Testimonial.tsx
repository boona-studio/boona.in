import { Readout, type ReadoutProps } from "./Readout";

export type TestimonialProps = {
  quote: string;
  /** Role and anonymised context: "Head of engineering, fintech, 40 people". Never a name or company. */
  attribution: string;
  /** Optional proof the quote refers to. */
  readout?: Omit<ReadoutProps, "size">;
};

/**
 * Testimonial — a quote on a rule, no photo, no logo. If there is a number behind the quote, the readout carries it.
 */
export function Testimonial({ quote, attribution, readout }: TestimonialProps) {
  return (
    <figure className="m-0 flex flex-col gap-4 border-t-heavy border-ink pt-5 max-w-measure">
      <blockquote className="m-0 text-lead">“{quote}”</blockquote>
      <figcaption className="text-small text-quiet">{attribution}</figcaption>
      {readout && <Readout size="sm" {...readout} />}
    </figure>
  );
}

export default Testimonial;
