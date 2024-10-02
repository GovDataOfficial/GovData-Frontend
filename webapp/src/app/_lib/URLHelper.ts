import { DefaultSortOption } from "@/types/types";
import { ReadonlyURLSearchParams } from "next/navigation";
import {
  convertToURLSearchParams,
  ValidSearchParamsForConversion,
} from "@/app/_lib/convertToSearchParams";

export const FILTERS = {
  SHOWCASE_TYPES: "showcase_types",
  GROUPS: "groups",
  PLATFORMS: "platforms",
  TAGS: "tags",
  STATE: "state",
  FORMAT: "format",
  OPENNESS: "openness",
  LICENCE: "licence",
  DATASERVICE: "dataservice",
  HVD: "hvd",
  HVD_CATEGORIES: "hvd_categories",
  SOURCEPORTAL: "sourceportal",
  TITLE: "title",
  PUBLISHER: "publisher",
  MAINTAINER: "maintainer",
  NOTES: "notes",
};

// not in preparedParams, only one may be active at a time.
export const SPECIAL_FILTERS = {
  QUERY: "q",
  TYPE: "type",
  BOUNDING_BOX: "boundingbox",
  START: "start",
  END: "end",
  SORT: "sort",
};

export const SEARCH_PARAMS_ALLOWLIST = [
  ...Object.values(FILTERS),
  ...Object.values(SPECIAL_FILTERS),
];

export const PAGES = {
  root: "/",
  search: "/suche",
  search_details_dataset: "/suche/daten",
  search_details_showcase: "/suche/anwendung",
  extendedSearch: "/erweitertesuche",
  geosearch: "/kartensuche",
  contact: "/kontakt",
  information: "/informationen",
  metadataquality: "/metadatenqualitaet",
  sparql: "/sparql-assistent",
  dlde: "/dl-de",
};

export const PAGES_AUTH = {
  manage_data: "/datenpflege",
  manage_data_form_add: "/datenpflege/metadaten/erstellen",
  manage_data_form_add_success: "/datenpflege/metadaten/erstellen/erfolgreich",
};

const createHref = (url: string, searchParams: URLSearchParams): string => {
  Array.from(searchParams.keys())
    .filter((key) => !SEARCH_PARAMS_ALLOWLIST.includes(key))
    .forEach((keyToRemove) => searchParams.delete(keyToRemove));

  const params = searchParams.toString();
  return params ? `${url}?${params}` : url;
};

export const createLinkToSearchForState = (id: string) =>
  PAGES.search + `?${FILTERS.STATE}=${id}`;

export const createLinkToSearchWithHVD = () =>
  PAGES.search + `?${FILTERS.HVD}=has_hvd`;

export const createLinkToSearchWithType = (type: string) =>
  PAGES.search + `?${SPECIAL_FILTERS.TYPE}=${type}`;

/**
 * Helper for any Filter/Sorting/Searching
 */
export function URLHelper(searchParams: ValidSearchParamsForConversion) {
  const currentSearchParams = convertToURLSearchParams(
    searchParams,
  ) as ReadonlyURLSearchParams;

  const getStartDateFromCurrentSearchParams = (): string | undefined => {
    return currentSearchParams.get(SPECIAL_FILTERS.START) || undefined;
  };

  const getEndDateFromCurrentSearchParams = (): string | undefined => {
    return currentSearchParams.get(SPECIAL_FILTERS.END) || undefined;
  };

  const createLinkToPageWithFilter = (
    page: (typeof PAGES)[keyof typeof PAGES],
  ) => {
    return createHref(page, currentSearchParams);
  };

  const createLinkToSearchWithoutFilter = (...key: string[]) => {
    const params = new URLSearchParams(currentSearchParams);
    key.forEach((k) => params.delete(k));
    return createHref(PAGES.search, params);
  };

  const createLinkToSearchWithoutExactFilter = (
    key: string,
    value?: string,
  ) => {
    const params = new URLSearchParams(currentSearchParams);
    params.delete(key, value);
    return createHref(PAGES.search, params);
  };

  const createLinkToSearchWithSuggestion = (suggestion: string) => {
    const params = new URLSearchParams({ [SPECIAL_FILTERS.QUERY]: suggestion });
    return createHref(PAGES.search, params);
  };

  const createLinkToSearchWithSort = (value: string) => {
    const params = new URLSearchParams(currentSearchParams);
    params.set(SPECIAL_FILTERS.SORT, value);
    return createHref(PAGES.search, params);
  };

  const createLinkToSearchWithType = (value: string) => {
    const params = new URLSearchParams(currentSearchParams);
    params.set(SPECIAL_FILTERS.TYPE, value);
    return createHref(PAGES.search, params);
  };

  const createLinkToSearchWithFilter = (
    key: string,
    value: string,
    remove?: boolean,
  ) => {
    const params = new URLSearchParams(currentSearchParams);

    if (remove) {
      params.delete(key, value);
    } else {
      params.append(key, value);
    }

    return createHref(PAGES.search, params);
  };

  const getActiveSortFromCurrentParams = () => {
    const activeSort =
      currentSearchParams.get(SPECIAL_FILTERS.SORT) || "relevance_desc";
    return activeSort || DefaultSortOption;
  };

  const getBoundingBoxValueFromCurrentParams = (): string | undefined => {
    return currentSearchParams.get(SPECIAL_FILTERS.BOUNDING_BOX) || undefined;
  };

  const getActiveTypeFromCurrentParams = () => {
    return currentSearchParams.get(SPECIAL_FILTERS.TYPE) || "all";
  };

  const isFilterActive = (key: string, value?: string) => {
    return currentSearchParams.has(key, value);
  };

  /**
   * Creates an Object[] to map to input fields for Forms that require these
   * to keep filters active between page visits.
   */
  const getActiveFiltersForHiddenInput = (...without: string[]) => {
    const objectParams = Array.from(currentSearchParams)
      .filter(([name]) => SEARCH_PARAMS_ALLOWLIST.includes(name))
      .map(([name, value]) => ({
        key: name + value,
        type: "hidden",
        name: name,
        defaultValue: value,
      }));

    if (without.length > 0) {
      return objectParams.filter((f) => !without.includes(f.name));
    }

    return objectParams;
  };

  const toggleParameter = (key: string, value: string) => {
    const params = new URLSearchParams(currentSearchParams);

    if (params.has(key, value)) {
      params.delete(key, value);
    } else {
      params.append(key, value);
    }
    return `?${params.toString()}`;
  };

  return {
    createLinkToPageWithFilter,
    createLinkToSearchWithoutFilter,
    createLinkToSearchWithoutExactFilter,
    createLinkToSearchWithSort,
    createLinkToSearchWithType,
    createLinkToSearchWithFilter,
    createLinkToSearchWithSuggestion,
    getStartDateFromCurrentSearchParams,
    getEndDateFromCurrentSearchParams,
    getActiveSortFromCurrentParams,
    getActiveFiltersForHiddenInput,
    getBoundingBoxValueFromCurrentParams,
    getActiveTypeFromCurrentParams,
    toggleParameter,
    isFilterActive,
  };
}
