import React, { PropsWithChildren } from "react";

type AnchorButton = {
  variant?: "primary" | "secondary";
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * Anchor that looks like buttons.
 */
export function AnchorButton({
  variant = "primary",
  className = "",
  children,
  ...rest
}: PropsWithChildren<AnchorButton>) {
  const classes = ["gd-button"];

  classes.push(`gd-button-${variant}`);

  return (
    <a {...rest} className={`${classes.join(" ")} ${className}`}>
      {children}
    </a>
  );
}
