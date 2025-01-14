import { PropsWithChildren } from "react";

type Fieldset = {
  legend: string;
  borderBottom?: boolean;
  className?: string;
  id?: string;
};
export function Fieldset({
  legend,
  children,
  className,
  id,
}: PropsWithChildren<Fieldset>) {
  return (
    <fieldset
      id={id}
      className={`d-flex flex-column border-bottom ${className || ""}`}
    >
      <legend className="h3 mb-2">{legend}</legend>
      {children}
    </fieldset>
  );
}
