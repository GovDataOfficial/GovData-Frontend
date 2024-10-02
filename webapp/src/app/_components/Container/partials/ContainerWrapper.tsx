import { PropsWithChildren } from "react";

type ContainerWrapper = {
  type: "div" | "section";
  modifier?: ContainerWrapperModifier[];
};

export enum ContainerWrapperModifier {
  BOTTOM_SEPARATOR = "gd-content-section-separator",
  MARGIN_TOP = "mt-5",
  PADDING_Y = "py-5",
  BG_WHITE = "bg-white",
}

export function ContainerWrapper({
  type = "div",
  modifier = [],
  children,
}: PropsWithChildren<ContainerWrapper>) {
  const Node = type;
  return <Node className={modifier?.join(" ")}>{children}</Node>;
}
