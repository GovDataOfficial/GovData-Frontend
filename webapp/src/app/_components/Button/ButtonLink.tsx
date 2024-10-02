import { PropsWithChildren } from "react";

type ButtonLink = {
  variant?: "primary" | "secondary";
  href?: string;
  id?: string;
  className?: string;
  target?: string;
};

// need to refactor button and links apart
export function ButtonLink({
  variant = "primary",
  href,
  className = "",
  id,
  target,
  children,
}: PropsWithChildren<ButtonLink>) {
  const classes = ["gd-button"];

  classes.push(`gd-button-${variant}`);

  return (
    <a
      href={href}
      id={id}
      target={target}
      className={`${classes.join(" ")} ${className}`}
    >
      {children}
    </a>
  );
}
