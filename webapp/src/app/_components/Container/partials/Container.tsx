import { PropsWithChildren } from "react";

export type Container = {
  containerWidth?: "lg" | "md" | "sm" | "930"; // maybe make lg default?
  noGutter?: boolean;
};
export function Container({
  children,
  noGutter,
  containerWidth,
}: PropsWithChildren<Container>) {
  const classes = ["container-fluid"];

  if (containerWidth) {
    classes.push("gd-container-fluid-" + containerWidth);
  }

  if (noGutter) {
    classes.push("g-0");
  }

  return <div className={classes.join(" ")}>{children}</div>;
}
