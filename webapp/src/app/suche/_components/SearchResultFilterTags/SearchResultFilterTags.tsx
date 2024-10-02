import {
  CleanedActiveFilters,
  NextJSSearchParams,
  RecordFilterMap,
} from "@/types/types";
import { i18n } from "@/i18n";
import { SearchResultFilterTag } from "@/app/suche/_components/SearchResultFilterTags/partials/SearchResultFilterTag";
import { isNotNullOrUndefined } from "@/types/typeGuards";
import { SPECIAL_FILTERS, URLHelper } from "@/app/_lib/URLHelper";
import { Time } from "@/app/_components/Time/Time";
import { findStateById } from "@/app/_lib/stateList";
import { findHvdCategory } from "@/app/_lib/hvdCategories";
import { getOrganizationDisplayName } from "@/app/_lib/getDisplayName";

type SearchResultFilterTags = {
  cleanedActiveFilters: CleanedActiveFilters;
  filterMap: RecordFilterMap;
  searchParams: NextJSSearchParams;
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
        return findHvdCategory(value)?.label;
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
