import { PropsWithChildren } from "react";

import { icons, SVG } from "@/app/_components/SVG/SVG";

type InfoBadge = PropsWithChildren<{
  className?: string;
}>;

export function InfoBadge({ children, className = "" }: InfoBadge) {
  return (
    <div className={`info-badge ${className}`} role="alert">
      <SVG icon={icons.info} className="mx-1"></SVG>
      <span>{children}</span>
    </div>
  );
}
