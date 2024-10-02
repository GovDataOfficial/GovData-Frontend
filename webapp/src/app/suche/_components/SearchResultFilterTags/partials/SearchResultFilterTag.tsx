import { i18n } from "@/i18n";
import { SVG, icons } from "@/app/_components/SVG/SVG";
import { PropsWithChildren } from "react";

type SearchResultFilterTag = {
  type: string;
  href: string;
};

export function SearchResultFilterTag({
  type,
  children,
  href,
}: PropsWithChildren<SearchResultFilterTag>) {
  return (
    <li className="filter-tag">
      {type}
      {children && (
        <>
          :&nbsp; <strong>{children}</strong>
        </>
      )}
      <a
        className="filter-tag-remove"
        href={href}
        title={i18n.t("filter.deactivate")}
      >
        <SVG icon={icons.remove} size="small" />
      </a>
    </li>
  );
}
