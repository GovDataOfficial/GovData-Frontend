import { PropsWithChildren } from "react";

type DesignBox = {
  extraClasses?: string[];
  noPadding?: boolean;
};
export function DesignBox({
  children,
  noPadding,
  extraClasses = [],
}: PropsWithChildren<DesignBox>) {
  const classNames = ["design-box"];

  if (!noPadding) {
    classNames.push("design-box-padding");
  }

  classNames.push(...extraClasses);

  return <div className={classNames.join(" ")}>{children}</div>;
}
