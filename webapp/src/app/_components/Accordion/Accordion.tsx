import { PropsWithChildren, ReactNode } from "react";

import { icons, SVG } from "@/app/_components/SVG/SVG";

type AccordionProps = PropsWithChildren<{
  title: NonNullable<ReactNode>;
  open?: boolean;
  variant?: "filter" | "link";
  rotateArrows?: boolean;
  ref?: React.Ref<HTMLDetailsElement>;
}>;

const Accordion = ({
  title,
  open,
  variant = "filter",
  children,
  rotateArrows,
  ref,
}: AccordionProps) => {
  return (
    <details
      className={`gd-accordion ${rotateArrows ? "gd-accordion-rotate-arrows" : ""}`}
      open={open}
      ref={ref}
    >
      <summary className={`gd-accordion-head gd-accordion-head-${variant}`}>
        {title}
        <SVG icon={icons.arrow_right} size="big" />
      </summary>
      <div className="gd-accordion-content">{children}</div>
    </details>
  );
};

Accordion.displayName = "Accordion";

export { Accordion };
