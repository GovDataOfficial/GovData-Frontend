import { PropsWithChildren } from "react";

type Fieldset = {
  legend: string;
  borderBottom?: boolean;
  className?: string;
};
export function Fieldset({
  legend,
  children,
  className,
}: PropsWithChildren<Fieldset>) {
  return (
    <fieldset className={`d-flex flex-column border-bottom ${className || ""}`}>
      <legend className="h3 mb-2">{legend}</legend>
      {children}
    </fieldset>
  );
}
