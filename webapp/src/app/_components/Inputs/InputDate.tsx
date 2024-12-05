import React, { useId } from "react";
import { Label } from "@/app/_components/Inputs/partials/Label";

type InputDate = {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
  recommended?: boolean;
  type?: "date" | "datetime-local";
};

function parseDateString(
  dateString: string,
  type: "date" | "datetime-local",
): string {
  return type === "date" ? dateString.split("T")[0] : dateString;
}

export function InputDate({
  label,
  name,
  required,
  recommended,
  defaultValue,
  type = "date",
}: InputDate) {
  const id = useId();

  const parsedDefaultValue = defaultValue
    ? parseDateString(defaultValue, type)
    : undefined;

  return (
    <div className="gd-input">
      <Label
        label={label}
        htmlFor={id}
        recommended={recommended}
        required={required}
      />
      <input
        required={required}
        data-recommended={recommended}
        id={id}
        type={type}
        defaultValue={parsedDefaultValue}
        name={name}
      />
    </div>
  );
}
