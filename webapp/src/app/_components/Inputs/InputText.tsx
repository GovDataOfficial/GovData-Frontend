import React, { forwardRef, PropsWithChildren, ReactNode, useId } from "react";

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
  readonly?: boolean;
  className?: string;
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
      readonly,
      className,
      children,
    },
    ref,
  ) => {
    const id = useId();

    return (
      <div className={`gd-input ${className}`}>
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
          readOnly={readonly}
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
