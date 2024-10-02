import { PropsWithChildren } from "react";

type FormRow = {
  type?: "even" | "1-2";
};

export function FormRow({
  type = "even",
  children,
}: PropsWithChildren<FormRow>) {
  return (
    <div className={"gd-form-row" + " gd-form-row-" + type}>{children}</div>
  );
}
