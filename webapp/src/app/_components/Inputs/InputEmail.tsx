import React, { useId, useRef } from "react";
import { useCustomValidation } from "@/app/_components/Inputs/useCustomValidation";
import { Label } from "@/app/_components/Inputs/partials/Label";

type InputEmail = {
  name: string;
  label: string;
  required?: boolean;
  recommended?: boolean;
  customValidationMessage?: string;
  defaultValue?: string;
  maxLength?: number;
};
export function InputEmail({
  label,
  name,
  required,
  recommended,
  defaultValue,
  maxLength,
  customValidationMessage,
}: InputEmail) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useCustomValidation(inputRef, customValidationMessage);

  return (
    <div className="gd-input">
      <Label
        label={label}
        htmlFor={id}
        recommended={recommended}
        required={required}
      />
      <input
        ref={inputRef}
        id={id}
        type="email"
        name={name}
        maxLength={maxLength}
        defaultValue={defaultValue}
        required={required}
        data-recommended={recommended}
      />
    </div>
  );
}
