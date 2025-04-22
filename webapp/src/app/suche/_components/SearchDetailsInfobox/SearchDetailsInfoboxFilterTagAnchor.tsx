"use client";

import { PropsWithChildren } from "react";

import { useTooltip } from "@/app/_lib/hooks/useTooltip";
import { FILTERS } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";

type FilterValue = (typeof FILTERS)[keyof typeof FILTERS];

export type SearchDetailsInfoboxFilterTagAnchor = {
  searchCriteria: FilterValue;
  searchCriteriaValue: string;
};

export function SearchDetailsInfoboxFilterTagAnchor({
  searchCriteria,
  searchCriteriaValue,
  children,
}: PropsWithChildren<SearchDetailsInfoboxFilterTagAnchor>) {
  const ref = useTooltip<HTMLAnchorElement>(undefined, 500);
  const getSearchLink = () => {
    return `/suche?${searchCriteria}=${encodeURIComponent(searchCriteriaValue)}`;
  };

  return (
    <a
      href={getSearchLink()}
      ref={ref}
      className={`filter-tag interactive mb-0_5 me-0_5`}
      title={i18n.t("search.details.infobox.tooltip", {
        target: i18n.t(
          `search.details.infobox.tooltip.target.${searchCriteria}`,
        ),
      })}
    >
      {children}
    </a>
  );
}
