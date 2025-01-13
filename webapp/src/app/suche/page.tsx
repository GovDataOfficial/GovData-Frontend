import React from "react";
import { Metadata } from "next";

import { ContainerDiv } from "@/app/_components/Container";
import { FilterAreaOpenMenuButton } from "@/app/_components/FilterArea";
import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { convertToURLSearchParams } from "@/app/_lib/convertToSearchParams";
import { getSearchResults } from "@/app/_lib/getData";
import { metaDataGenerator } from "@/app/_lib/getMetaData";
import { numberToLocaleString } from "@/app/_lib/number";
import { stripSearchResultHTMLContent } from "@/app/_lib/sanitizer/sanitizeHtml";
import { ExtendedSearchLink } from "@/app/suche/_components/common/ExtendedSearchLink";
import { SearchResultFilterTags } from "@/app/suche/_components/SearchResultFilterTags/SearchResultFilterTags";
import { SearchResultsContainer } from "@/app/suche/_components/SearchResults/SearchResultsContainer";
import { SearchResultsEmpty } from "@/app/suche/_components/SearchResults/SearchResultsEmpty";
import { SearchResultsFilterArea } from "@/app/suche/_components/SearchResultsFilterArea/SearchResultsFilterArea";
import { SearchResultSortBy } from "@/app/suche/_components/SearchResultSortBy/SearchResultSortBy";
import { TypeListFilter } from "@/app/suche/_components/SearchResultTypeFilter/TypeListFilter";
import { TypeListFilterMobile } from "@/app/suche/_components/SearchResultTypeFilter/TypeListFilterMobile";
import { i18n } from "@/i18n";
import { isNotNullOrUndefined } from "@/types/typeGuards";
import { PageConstructor, SearchResults } from "@/types/types";

function getQueryParam(searchParams: PageConstructor["searchParams"]) {
  const params = convertToURLSearchParams(searchParams);
  const q = params.get("q");
  return isNotNullOrUndefined(q) && q !== "" ? q : undefined;
}

export async function generateMetadata({
  searchParams,
}: PageConstructor): Promise<Metadata> {
  const q = getQueryParam(searchParams);
  const title = q
    ? i18n.t("meta.search.titleQuery", { q: q })
    : i18n.t("meta.search.title");

  return metaDataGenerator({
    title,
    description: i18n.t("meta.search.description"),
  });
}

const dataHasHits = (data?: SearchResults) => data && data.hitsTotal > 0;

function getHeadline(data: SearchResults, q?: string) {
  const hasHits = dataHasHits(data);
  switch (true) {
    case !hasHits && isNotNullOrUndefined(q):
      return i18n.t("search.empty.titleWithQuery", { query: q });
    case !hasHits:
      return i18n.t("search.empty.title");
    default:
      return `${numberToLocaleString(data.hitsTotal)} ${i18n.t("search.hits")}`;
  }
}

export default async function Suche({ searchParams }: PageConstructor) {
  const data = await getSearchResults(searchParams);

  if (!data) {
    return (
      <ContainerDiv containerWidth="lg">
        <InfoBox
          className="mt-3"
          title={i18n.t("error.alert.common")}
          variant="error"
        />
      </ContainerDiv>
    );
  }

  const hasHits = dataHasHits(data);
  const q = getQueryParam(searchParams);
  const title = getHeadline(data, q);

  return (
    <>
      <ContainerDiv containerWidth="lg">
        <div className="row mt-3">
          <div className="col-12 col-md-8 offset-md-4">
            <h1 className="m-0 ">{title}</h1>
          </div>
        </div>
      </ContainerDiv>
      <ContainerDiv containerWidth="lg">
        <div className="row mt-3 mt-md-0" id="contentPane">
          <h2 className="sr-only d-md-none">
            {i18n.t("search.results.filter.title")}
          </h2>
          <div className="col-sm-12 col-md-4 d-none d-md-block">
            <SearchResultsFilterArea data={data} />
          </div>
          <div className="col-sm-12 col-md-8 mt-md-5">
            <TypeListFilter data={data} searchParams={searchParams} />
            <TypeListFilterMobile data={data} searchParams={searchParams} />
            <ExtendedSearchLink className="d-block d-md-none mb-3 mt-3" />
            <FilterAreaOpenMenuButton showForMediumDown />
            <div className="search-results-tag-sort-container">
              <h3 className="sr-only">
                {i18n.t("search.results.filter.activeFilter.title")}
              </h3>
              <div className="search-results-tag-sort-container-tags">
                <SearchResultFilterTags
                  searchParams={searchParams}
                  filterMap={data.filterMap}
                  cleanedActiveFilters={data.cleanedActiveFilters}
                />
              </div>
              {hasHits && (
                <div className="search-results-tag-sort-container-sort">
                  <SearchResultSortBy />
                </div>
              )}
            </div>
            {hasHits ? (
              <SearchResultsContainer
                data={stripSearchResultHTMLContent(data)}
              />
            ) : (
              <SearchResultsEmpty suggestions={data.suggestions} />
            )}
          </div>
        </div>
      </ContainerDiv>
    </>
  );
}
