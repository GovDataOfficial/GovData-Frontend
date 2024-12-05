import { PropsWithChildren, ReactNode } from "react";
import { SVG, icons } from "@/app/_components/SVG/SVG";

type Accordion = {
  title: NonNullable<ReactNode>;
  open?: boolean;
  variant?: "filter" | "link";
};

export function Accordion({
  title,
  open,
  variant = "filter",
  children,
}: PropsWithChildren<Accordion>) {
  return (
    <details className="gd-accordion" open={open}>
      <summary className={`gd-accordion-head gd-accordion-head-${variant}`}>
        {title}
        <SVG icon={icons.arrow_right} size="big" />
      </summary>
      <div className="gd-accordion-content">{children}</div>
    </details>
  );
}
