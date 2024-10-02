import React, { PropsWithChildren, useId } from "react";
import { RequiredInfo } from "@/app/_components/Inputs/partials/RequiredInfo";
import { RecommendedInfo } from "@/app/_components/Inputs/partials/RecommendedInfo";

type Select<T> = {
  label: string;
  onChange?: (value: T) => void;
  value?: string;
  required?: boolean;
  labelInvisible?: boolean;
  className?: string;
  name?: string;
  showNoValueOption?: boolean;
  recommended?: boolean;
};

export function Select<T>({
  label,
  labelInvisible,
  children,
  onChange,
  value,
  required,
  name,
  className = "",
  showNoValueOption,
  recommended,
}: PropsWithChildren<Select<T>>) {
  const id = useId();

  if (React.Children.count(children) === 0) {
    return null;
  }

  return (
    <div className={`gd-input ${className}`}>
      <label className={labelInvisible ? "sr-only" : ""} htmlFor={id}>
        {label}
        {required && <RequiredInfo />}
        {recommended && <RecommendedInfo />}
      </label>
      <select
        id={id}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value as T);
          }
        }}
        name={name}
        value={value}
        required={required}
        data-recommended={recommended}
      >
        {showNoValueOption && <option value="">Keine Angabe</option>}

        {children}
      </select>
    </div>
  );
}
