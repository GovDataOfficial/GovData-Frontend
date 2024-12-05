import React, { PropsWithChildren, ReactNode, useId, forwardRef } from "react";
import { Label } from "@/app/_components/Inputs/partials/Label";

type InputTextProps = {
  name?: string;
  label: string;
  required?: boolean;
  recommended?: boolean;
  description?: ReactNode;
  defaultValue?: string;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputText = forwardRef<
  HTMLInputElement,
  PropsWithChildren<InputTextProps>
>(
  (
    {
      label,
      name,
      required,
      recommended,
      onChange,
      defaultValue,
      maxLength,
      children,
    },
    ref,
  ) => {
    const id = useId();

    return (
      <div className="gd-input">
        <Label
          label={label}
          htmlFor={id}
          recommended={recommended}
          required={required}
        />
        <input
          ref={ref}
          id={id}
          type="text"
          name={name}
          required={required}
          data-recommended={recommended}
          onChange={onChange}
          defaultValue={defaultValue}
          maxLength={maxLength}
        />
        {children}
      </div>
    );
  },
);

InputText.displayName = "InputText";

export { InputText };
