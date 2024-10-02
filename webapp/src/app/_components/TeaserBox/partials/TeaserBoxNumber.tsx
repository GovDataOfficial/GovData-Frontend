import { TeaserBox } from "@/app/_components/TeaserBox/partials/TeaserBox";
import { SVG, icons } from "@/app/_components/SVG/SVG";
import React from "react";

type TeaserBoxNumber = {
  name: string;
  docCount: number;
  icon: keyof typeof icons;
  href: string;
};

export function TeaserBoxNumber({
  name,
  docCount,
  icon,
  href,
}: TeaserBoxNumber) {
  return (
    <TeaserBox theme="dark" href={href}>
      <SVG size="32" icon={icon} />
      <div className="gd-teaser-box-numbers-heading mt-1">
        {docCount?.toLocaleString()}
      </div>
      <p className="paragraph bold">{name}</p>
    </TeaserBox>
  );
}
