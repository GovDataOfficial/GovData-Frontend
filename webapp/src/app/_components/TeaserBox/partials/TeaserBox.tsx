import React, { HTMLAttributeAnchorTarget, PropsWithChildren } from "react";

type TeaserBox = {
  theme: "bright" | "dark";
  href: string;
  target?: HTMLAttributeAnchorTarget;
};

export function TeaserBox({
  children,
  theme,
  href,
  target,
}: PropsWithChildren<TeaserBox>) {
  return (
    <a
      href={href}
      target={target}
      className={`gd-teaser-box gd-teaser-box-${theme}`}
    >
      {children}
    </a>
  );
}
