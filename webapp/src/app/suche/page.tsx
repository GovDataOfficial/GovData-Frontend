import React from "react";
import { Metadata } from "next";
import { getSearchResults } from "@/app/_lib/getData";
import { PageConstructor, SearchResults } from "@/types/types";
import { i18n } from "@/i18n";
import { SearchResultsFilterArea } from "@/app/suche/_components/SearchResultsFilterArea/SearchResultsFilterArea";
import { SearchResultsContainer } from "@/app/suche/_components/SearchResults/SearchResultsContainer";
import { FilterAreaOpenMenuButton } from "@/app/_components/FilterArea";
import { TypeListFilter } from "@/app/suche/_components/SearchResultTypeFilter/TypeListFilter";
import { SearchResultFilterTags } from "@/app/suche/_components/SearchResultFilterTags/SearchResultFilterTags";
import { SearchResultSortBy } from "@/app/suche/_components/SearchResultSortBy/SearchResultSortBy";
import { TypeListFilterMobile } from "@/app/suche/_components/SearchResultTypeFilter/TypeListFilterMobile";
import { SearchResultsEmpty } from "@/app/suche/_components/SearchResults/SearchResultsEmpty";
import { stripSearchResultHTMLContent } from "@/app/_lib/sanitizer/sanitizeHtml";
import { ExtendedSearchLink } from "@/app/suche/_components/common/ExtendedSearchLink";
import { AlertBadge } from "@/app/_components/AlertBadge/AlertBadge";
import { ContainerDiv } from "@/app/_components/Container";
import { convertToURLSearchParams } from "@/app/_lib/convertToSearchParams";
import { isNotNullOrUndefined } from "@/types/typeGuards";
import { metaDataGenerator } from "@/app/_lib/getMetaData";

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
      return `${data.hitsTotal.toLocaleString()} ${i18n.t("search.hits")}`;
  }
}

export default async function Suche({ searchParams }: PageConstructor) {
  const data = await getSearchResults(searchParams);

  if (!data) {
    return (
      <ContainerDiv containerWidth="lg">
        <AlertBadge>{i18n.t("error.alert.common")}</AlertBadge>
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
