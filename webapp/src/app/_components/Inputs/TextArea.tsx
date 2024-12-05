import React, { useId, useRef } from "react";
import { useCustomValidation } from "@/app/_components/Inputs/useCustomValidation";
import { Label } from "@/app/_components/Inputs/partials/Label";

type TextArea = {
  name: string;
  label: string;
  required?: boolean;
  recommended?: boolean;
  maxLength?: number;
  defaultValue?: string;
  customValidationMessage?: string;
};
export function TextArea({
  name,
  label,
  required,
  recommended,
  defaultValue,
  maxLength,
  customValidationMessage,
}: TextArea) {
  const id = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useCustomValidation(textareaRef, customValidationMessage);

  return (
    <div className="gd-input">
      <Label
        label={label}
        htmlFor={id}
        recommended={recommended}
        required={required}
      />
      <textarea
        ref={textareaRef}
        id={id}
        name={name}
        maxLength={maxLength}
        defaultValue={defaultValue}
        required={required}
        data-recommended={recommended}
      />
    </div>
  );
}
