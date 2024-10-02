import { PropsWithChildren } from "react";

type Fieldset = {
  legend: string;
  borderBottom?: boolean;
};
export function Fieldset({
  legend,
  borderBottom,
  children,
}: PropsWithChildren<Fieldset>) {
  return (
    <fieldset className={borderBottom ? "border-bottom mb-2" : undefined}>
      <legend className="h3 mb-2">{legend}</legend>
      {children}
    </fieldset>
  );
}
