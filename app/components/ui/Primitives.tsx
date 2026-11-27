import { tv } from "tailwind-variants";

export const buttonVariants = tv({
  base: "pf-btn",
  variants: {
    intent: {
      dark: "pf-btn-dark",
      ghost: "pf-btn-ghost",
      bloom: "pf-btn-bloom",
    },
  },
  defaultVariants: {
    intent: "dark",
  },
});

export const ArrowRightIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    aria-hidden="true"
  >
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

export const ChevronDownIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    aria-hidden="true"
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

export const ArrowUpRightIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    aria-hidden="true"
  >
    <path d="M5 11l6-6M6 5h5v5" />
  </svg>
);

type SectionHeaderProps = {
  id?: string;
  kicker: string;
  title: string;
  lead: string;
};

export const SectionHeader = ({ id, kicker, title, lead }: SectionHeaderProps) => (
  <div className="sec-head rv">
    <span className="sec-kicker">{kicker}</span>
    <h2 id={id}>{title}</h2>
    <p className="lead">{lead}</p>
  </div>
);
