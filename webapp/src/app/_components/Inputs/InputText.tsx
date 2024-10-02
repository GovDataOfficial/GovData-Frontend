import React, { PropsWithChildren, ReactNode, useId } from "react";
import { RequiredInfo } from "@/app/_components/Inputs/partials/RequiredInfo";
import { RecommendedInfo } from "@/app/_components/Inputs/partials/RecommendedInfo";

type InputText = {
  name: string;
  label: string;
  required?: boolean;
  recommended?: boolean;
  description?: ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export function InputText({
  label,
  name,
  required,
  recommended,
  onChange,
  children,
}: PropsWithChildren<InputText>) {
  const id = useId();

  return (
    <div className="gd-input">
      <label htmlFor={id}>
        {label}
        {required && <RequiredInfo />}
        {recommended && <RecommendedInfo />}
      </label>
      <input
        id={id}
        type="text"
        name={name}
        required={required}
        data-recommended={recommended}
        onChange={onChange}
      />
      {children}
    </div>
  );
}
