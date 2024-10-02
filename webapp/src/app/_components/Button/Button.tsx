import { PropsWithChildren } from "react";

type Button = {
  variant?: "primary" | "secondary" | "a" | "icon";
  href?: string;
  id?: string;
  onClick?: (e: any) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  ariaExpanded?: HTMLButtonElement["ariaExpanded"];
  ariaControls?: string;
};

// need to refactor button and links apart
export function Button({
  variant = "primary",
  className = "",
  onClick,
  id,
  type = "button",
  ariaExpanded,
  ariaControls,
  children,
}: PropsWithChildren<Button>) {
  const classes = ["gd-button"];

  classes.push(`gd-button-${variant}`);

  return (
    //@ts-expect-error typing for aria passed props is wrong
    <button
      id={id}
      type={type}
      className={`${classes.join(" ")} ${className}`}
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
    >
      {children}
    </button>
  );
}
