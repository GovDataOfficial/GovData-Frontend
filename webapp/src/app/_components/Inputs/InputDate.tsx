import React, { useId } from "react";
import { RequiredInfo } from "@/app/_components/Inputs/partials/RequiredInfo";
import { RecommendedInfo } from "@/app/_components/Inputs/partials/RecommendedInfo";

type InputDate = {
  name: string;
  label: string;
  required?: boolean;
  recommended?: boolean;
};
export function InputDate({ label, name, required, recommended }: InputDate) {
  const id = useId();

  return (
    <div className="gd-input">
      <label htmlFor={id}>
        {label}
        {required && <RequiredInfo />}
        {recommended && <RecommendedInfo />}
      </label>
      <input
        required={required}
        data-recommended={recommended}
        id={id}
        type="date"
        name={name}
      />
    </div>
  );
}
