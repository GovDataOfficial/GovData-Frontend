import React, { forwardRef, PropsWithChildren, ReactNode, useId } from "react";

import { Label } from "@/app/_components/Inputs/partials/Label";

type InputUrl = {
  name?: string;
  label: string;
  required?: boolean;
  recommended?: boolean;
  description?: ReactNode;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  className?: string;
};
const InputUrl = forwardRef<HTMLInputElement, PropsWithChildren<InputUrl>>(
  (
    {
      label,
      name,
      required,
      recommended,
      onChange,
      defaultValue,
      maxLength,
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
          id={id}
          type="url"
          name={name}
          maxLength={maxLength}
          required={required}
          data-recommended={recommended}
          onChange={onChange}
          defaultValue={defaultValue}
          ref={ref}
        />
        {children}
      </div>
    );
  },
);

InputUrl.displayName = "InputUrl";

export { InputUrl };
