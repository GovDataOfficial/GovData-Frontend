import React, { useId, useRef } from "react";
import { useCustomValidation } from "@/app/_components/Inputs/useCustomValidation";
import { RequiredInfo } from "@/app/_components/Inputs/partials/RequiredInfo";
import { RecommendedInfo } from "@/app/_components/Inputs/partials/RecommendedInfo";

type TextArea = {
  name: string;
  label: string;
  required?: boolean;
  recommended?: boolean;
  maxLength?: number;
  customValidationMessage?: string;
};
export function TextArea({
  name,
  label,
  required,
  recommended,
  maxLength,
  customValidationMessage,
}: TextArea) {
  const id = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useCustomValidation(textareaRef, customValidationMessage);

  return (
    <div className="gd-input">
      <label htmlFor={id}>
        {label}
        {required && <RequiredInfo />}
        {recommended && <RecommendedInfo />}
      </label>
      <textarea
        ref={textareaRef}
        id={id}
        name={name}
        maxLength={maxLength}
        required={required}
        data-recommended={recommended}
      />
    </div>
  );
}
