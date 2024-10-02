import { PropsWithChildren } from "react";
import { SVG, icons } from "@/app/_components/SVG/SVG";

type Accordion = {
  title: string;
  open?: boolean;
};

export function Accordion({
  title,
  open,
  children,
}: PropsWithChildren<Accordion>) {
  return (
    <details className="gd-accordion" open={open}>
      <summary className="gd-accordion-head">
        <h3 className="m-0 paragraph bold">{title}</h3>
        <SVG icon={icons.arrow_right} size="big" />
      </summary>
      <div className="gd-accordion-content">{children}</div>
    </details>
  );
}
