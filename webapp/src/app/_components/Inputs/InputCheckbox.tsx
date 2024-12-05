import React, { useId } from "react";
import { Label } from "@/app/_components/Inputs/partials/Label";

type InputCheckbox = {
  name: string;
  label: string;
  defaultChecked?: boolean;
};
export function InputCheckbox({ label, name, defaultChecked }: InputCheckbox) {
  const id = useId();

  return (
    <div className="gd-input gd-input-checkbox">
      <input
        id={id}
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
      />
      <Label label={label} htmlFor={id} />
    </div>
  );
}
