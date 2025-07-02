import React, { useId, useRef } from "react";

import { Label } from "@/app/_components/Inputs/partials/Label";
import { useCustomValidation } from "@/app/_components/Inputs/useCustomValidation";
import { useSpatialValidation } from "@/app/_components/Inputs/useSpatialValidation";

type SpatialTextArea = {
  name: string;
  label: string;
  required?: boolean;
  recommended?: boolean;
  maxLength?: number;
  defaultValue?: string;
};
export function SpatialTextArea({
  name,
  label,
  required,
  recommended,
  defaultValue,
  maxLength,
}: SpatialTextArea) {
  const id = useId();
  const { setElementRef, onTextareaChange } = useSpatialValidation();

  return (
    <div className="gd-input">
      <Label
        label={label}
        htmlFor={id}
        recommended={recommended}
        required={required}
      />
      <textarea
        ref={setElementRef}
        id={id}
        name={name}
        maxLength={maxLength}
        defaultValue={defaultValue}
        required={required}
        data-recommended={recommended}
        onChange={onTextareaChange}
      />
    </div>
  );
}
