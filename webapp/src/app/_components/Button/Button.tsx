import React, { forwardRef, PropsWithChildren } from "react";

type Button = {
  variant?: "primary" | "secondary" | "a";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, PropsWithChildren<Button>>(
  (props, ref) => {
    const {
      variant = "primary",
      children,
      className,

      ...buttonProps
    } = props;

    const classes = ["gd-button"];
    classes.push(`gd-button-${variant}`);

    return (
      <button
        ref={ref}
        className={`${classes.join(" ")} ${className || ""}`}
        {...buttonProps}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "NewButton";
