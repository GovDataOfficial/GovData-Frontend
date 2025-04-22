"use client";

import { DropdownSelect } from "@/app/_components/Dropdown/DropdownSelect";
import { URLHelper } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";
import {
  NextJSSearchParams,
  SearchResults,
  UnknownSearchResultHit,
} from "@/types/types";

type TypeListFilterMobile = {
  data: SearchResults<UnknownSearchResultHit>;
  searchParams: NextJSSearchParams;
};

export function TypeListFilterMobile({
  data,
  searchParams,
}: TypeListFilterMobile) {
  const { getActiveTypeFromCurrentParams, createLinkToSearchWithType } =
    URLHelper(searchParams);

  if (!data.filterMap.type) {
    return null;
  }

  return (
    <div className="search-result-document-type-list-mobile d-block d-sm-none sm">
      <DropdownSelect
        options={data.filterMap.type.facetList}
        title={i18n.t("filter.type." + getActiveTypeFromCurrentParams())}
        label={i18n.t("filter.type.label")}
      >
        {(facet) => (
          <a href={createLinkToSearchWithType(facet.name)}>
            {i18n.t("filter.type." + facet.name)}
          </a>
        )}
      </DropdownSelect>
    </div>
  );
}
