import React, { ReactNode } from "react";
import { InputText } from "@/app/_components/Inputs/InputText";
import { InputTextMultipleDescription } from "@/app/_components/Inputs/partials/InputTextMultipleDescription";

type InputTextMultiple = {
  name: string;
  label: string;
  required?: boolean;
  examples?: ReactNode[];
  recommended?: boolean;
  defaultValue?: string[];
  maxLength?: number;
  descriptionTitle?: string;
};

/**
 * Input text that will comma separate values.
 */
export function InputTextMultiple({
  label,
  name,
  required,
  examples,
  recommended,
  defaultValue,
  maxLength,
  descriptionTitle,
}: InputTextMultiple) {
  return (
    <InputText
      label={label}
      name={name}
      required={required}
      recommended={recommended}
      defaultValue={defaultValue?.join(", ")}
      maxLength={maxLength}
    >
      <InputTextMultipleDescription
        descriptionTitle={descriptionTitle}
        examples={examples}
      />
    </InputText>
  );
}
