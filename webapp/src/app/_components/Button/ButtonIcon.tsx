import React, { ComponentProps } from "react";

import { SVG } from "@/app/_components/SVG/SVG";
import { useTooltip } from "@/app/_lib/hooks/useTooltip";

type ButtonIcon = {
  icon: ComponentProps<typeof SVG>["icon"];
  size?: ComponentProps<typeof SVG>["size"];
  title?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function ButtonIcon({
  icon,
  className,
  size = "small",
  title,
  ...rest
}: ButtonIcon) {
  const ref = useTooltip<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      className={`gd-button gd-button-icon ${className || ""}`}
      {...rest}
      title={title}
    >
      <SVG icon={icon} size={size} />
    </button>
  );
}
