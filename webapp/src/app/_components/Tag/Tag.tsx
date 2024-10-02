import { PropsWithChildren } from "react";

export type Tag = {
  variant?: "green" | "yellow" | "hvd-icon";
  uppercase?: boolean;
  className?: string;
  title?: string;
  truncate?: boolean;
};

export function Tag({
  children,
  variant,
  uppercase,
  className,
  title,
  truncate,
}: PropsWithChildren<Tag>) {
  const classes = [];

  if (variant) {
    classes.push(variant);
  } else {
    classes.push("black");
  }

  if (uppercase) {
    classes.push("text-uppercase");
  }

  if (truncate) {
    classes.push("gd-truncate-single mw-140");
  }

  return (
    <div
      title={title}
      className={`gd-tag ${classes.join(" ")} ${className || ""}`}
    >
      {children}
    </div>
  );
}
