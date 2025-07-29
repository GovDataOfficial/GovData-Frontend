import React, { PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<
  {
    variant?: "primary" | "secondary" | "a";
    ref?: React.Ref<HTMLButtonElement>;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>;

export const Button = ({
  variant = "primary",
  children,
  className,
  ref,
  ...buttonProps
}: ButtonProps) => {
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
};

Button.displayName = "NewButton";
