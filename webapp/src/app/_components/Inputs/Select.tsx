import React, { PropsWithChildren, useId } from "react";
import { Label } from "@/app/_components/Inputs/partials/Label";
import { i18n } from "@/i18n";

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
  defaultValue?: string;
};

export function Select<T>({
  label,
  labelInvisible,
  children,
  onChange,
  value,
  defaultValue,
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
      <Label
        label={label}
        htmlFor={id}
        recommended={recommended}
        required={required}
        invisible={labelInvisible}
      />
      <select
        id={id}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value as T);
          }
        }}
        name={name}
        value={value}
        defaultValue={defaultValue}
        required={required}
        data-recommended={recommended}
      >
        {showNoValueOption && (
          <option value="">
            {required
              ? i18n.t("inputs.select.placeholder.required")
              : i18n.t("inputs.select.placeholder.optional")}
          </option>
        )}
        {children}
      </select>
    </div>
  );
}
