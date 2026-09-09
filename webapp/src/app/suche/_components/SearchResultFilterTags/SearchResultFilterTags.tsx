import { Time } from "@/app/_components/Time/Time";
import { labelForHvdUri } from "@/app/_lib/hvdCategories";
import { getOrganizationDisplayName } from "@/app/_lib/organization";
import { findStateById } from "@/app/_lib/stateList";
import { SPECIAL_FILTERS, URLHelper } from "@/app/_lib/URLHelper";
import { SearchResultFilterTag } from "@/app/suche/_components/SearchResultFilterTags/partials/SearchResultFilterTag";
import { i18n } from "@/i18n";
import { isNotNullOrUndefined } from "@/types/typeGuards";
import {
  CleanedActiveFilters,
  HvdCategoryMap,
  NextJSSearchParams,
  RecordFilterMap,
} from "@/types/types";

type SearchResultFilterTags = {
  cleanedActiveFilters: CleanedActiveFilters;
  filterMap: RecordFilterMap;
  searchParams: NextJSSearchParams;
  /**
   * Backend-provided HVD vocabulary; used to render the label for an active
   * `hvd_categories` filter chip. Falls back to the URI when unknown.
   */
  hvdMap?: HvdCategoryMap;
};

/**
 * Search Result Filter Tags.
 * Shows current active Facets/Filters with a link to deactivate said filter.
 * Information usually comes from cleanedActiveFilters param with few exceptions where we need the filtermap.
 */
export function SearchResultFilterTags({
  cleanedActiveFilters,
  filterMap,
  searchParams,
  hvdMap = {},
}: SearchResultFilterTags) {
  const {
    getStartDateFromCurrentSearchParams,
    getEndDateFromCurrentSearchParams,
    createLinkToSearchWithoutExactFilter,
    createLinkToSearchWithoutFilter,
  } = URLHelper(searchParams);
  const { t } = i18n;

  const activeFilters = Object.entries(cleanedActiveFilters || {});

  const boundingBoxActive = isNotNullOrUndefined(filterMap.boundingbox);

  const startDate =
    isNotNullOrUndefined(filterMap.start) &&
    getStartDateFromCurrentSearchParams();

  const endDate =
    isNotNullOrUndefined(filterMap.end) && getEndDateFromCurrentSearchParams();

  if (
    activeFilters.length === 0 &&
    !startDate &&
    !endDate &&
    !boundingBoxActive
  ) {
    return null;
  }

  const getFilterTranslationByName = (filterName: string, value: string) => {
    switch (filterName) {
      case "licence":
        return t("licenses::" + value);
      case "hvd_categories":
        // cleanedActiveFilters values are URL-encoded when they arrive from search
        // params; decode before looking up in the URI-keyed vocabulary map.
        return labelForHvdUri(decodeURIComponent(value), hvdMap);
      case "groups":
        return t("category.label." + value);
      case "state":
        return findStateById(value)?.name || value;
      case "sourceportal":
        return getOrganizationDisplayName(value);
      default:
        return t("filter." + filterName + "." + value, { defaultValue: value });
    }
  };

  return (
    <div>
      <span className="sr-only">{t("search.filter.by")}:</span>
      <ul className="filter-tags">
        {activeFilters?.map((activeFilter) => {
          const [filterName, values] = activeFilter;
          return values.map((value) => (
            <SearchResultFilterTag
              key={filterName + value}
              type={t("filter." + filterName + ".title")}
              href={createLinkToSearchWithoutExactFilter(filterName, value)}
            >
              {getFilterTranslationByName(filterName, value)}
            </SearchResultFilterTag>
          ));
        })}

        {boundingBoxActive && (
          <SearchResultFilterTag
            type={t("search.details.infobox.geoCoding")}
            href={createLinkToSearchWithoutFilter(SPECIAL_FILTERS.BOUNDING_BOX)}
          />
        )}

        {startDate && (
          <SearchResultFilterTag
            type={`${t("filter.temporal_coverage.extended.title")} ${t("filter.temporal_coverage.from").toLowerCase()}`}
            href={createLinkToSearchWithoutFilter(SPECIAL_FILTERS.START)}
          >
            <Time date={startDate} />
          </SearchResultFilterTag>
        )}
        {endDate && (
          <SearchResultFilterTag
            type={`${t("filter.temporal_coverage.extended.title")} ${t("filter.temporal_coverage.until").toLowerCase()}`}
            href={createLinkToSearchWithoutFilter(SPECIAL_FILTERS.END)}
          >
            <Time date={endDate} />
          </SearchResultFilterTag>
        )}
      </ul>
    </div>
  );
}
