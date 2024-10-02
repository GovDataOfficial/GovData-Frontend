import React, { useId, useRef } from "react";
import { useCustomValidation } from "@/app/_components/Inputs/useCustomValidation";
import { RequiredInfo } from "@/app/_components/Inputs/partials/RequiredInfo";
import { RecommendedInfo } from "@/app/_components/Inputs/partials/RecommendedInfo";

type InputEmail = {
  name: string;
  label: string;
  required?: boolean;
  recommended?: boolean;
  customValidationMessage?: string;
};
export function InputEmail({
  label,
  name,
  required,
  recommended,
  customValidationMessage,
}: InputEmail) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useCustomValidation(inputRef, customValidationMessage);

  return (
    <div className="gd-input">
      <label htmlFor={id}>
        {label}
        {required && <RequiredInfo />}
        {recommended && <RecommendedInfo />}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="email"
        name={name}
        required={required}
        data-recommended={recommended}
      />
    </div>
  );
}
