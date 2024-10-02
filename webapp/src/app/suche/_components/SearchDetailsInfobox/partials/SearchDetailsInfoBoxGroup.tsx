import { PropsWithChildren, Children } from "react";

type SearchDetailsInfoBoxGroup = {
  inline?: boolean;
};

export function SearchDetailsInfoBoxGroup({
  children,
  inline,
}: PropsWithChildren<SearchDetailsInfoBoxGroup>) {
  const className = ["searchdetails-infobox-group"];

  if (inline) {
    className.push("searchdetails-infobox-group-inline");
  }

  return <div className={className.join(" ")}>{children}</div>;
}
