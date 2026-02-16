import React, { HTMLAttributeAnchorTarget, PropsWithChildren } from "react";

type TeaserBox = {
  theme: "bright" | "dark";
  href: string;
  target?: HTMLAttributeAnchorTarget;
  rel?: string;
};

export function TeaserBox({
  children,
  theme,
  href,
  target,
  rel,
}: PropsWithChildren<TeaserBox>) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`gd-teaser-box gd-teaser-box-${theme}`}
    >
      {children}
    </a>
  );
}
