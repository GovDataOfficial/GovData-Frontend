import React, { useId } from "react";

type InputCheckbox = {
  name: string;
  label: string;
};
export function InputCheckbox({ label, name }: InputCheckbox) {
  const id = useId();

  return (
    <div className="gd-input gd-input-checkbox">
      <input id={id} type="checkbox" name={name} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
