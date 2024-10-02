import { PropsWithChildren } from "react";
import { DesignBox } from "@/app/_components/DesignBox/DesignBox";

type SearchDetailsInfoBoxContainer = {
  headline: string;
  hvd?: boolean;
};

export function SearchDetailsInfoBoxContainer({
  children,
  headline,
  hvd,
}: PropsWithChildren<SearchDetailsInfoBoxContainer>) {
  const containerClass = ["searchdetails-infobox", "mt-lg-0"];

  if (hvd) {
    containerClass.push("hvd");
  }

  return (
    <DesignBox extraClasses={containerClass}>
      <h2 className="mt-1 h3">{headline}</h2>
      {children}
    </DesignBox>
  );
}
