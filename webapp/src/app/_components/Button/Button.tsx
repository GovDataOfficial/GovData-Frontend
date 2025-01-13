import React, { forwardRef, PropsWithChildren } from "react";

type Button = {
  variant?: "primary" | "secondary" | "a" | "icon";
  href?: string;
  id?: string;
  onClick?: (e: any) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  title?: string;
  ariaExpanded?: HTMLButtonElement["ariaExpanded"];
  ariaControls?: string;
  ariaLabel?: string;
};

const Button = forwardRef<HTMLButtonElement, PropsWithChildren<Button>>(
  (
    {
      variant = "primary",
      className = "",
      onClick,
      id,
      type = "button",
      title,
      ariaLabel,
      ariaExpanded,
      ariaControls,
      children,
    },
    ref,
  ) => {
    const classes = ["gd-button"];

    classes.push(`gd-button-${variant}`);

    return (
      //@ts-expect-error typing for aria passed props is wrong
      <button
        ref={ref}
        id={id}
        type={type}
        className={`${classes.join(" ")} ${className}`}
        onClick={onClick}
        title={title}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
