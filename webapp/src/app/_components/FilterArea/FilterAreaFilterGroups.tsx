import {
  FilterCommon,
  FilterCommonConsumer,
} from "@/app/_components/FilterArea/filters/FilterCommon";
import { labelForHvdUri } from "@/app/_lib/hvdCategories";
import { i18n } from "@/i18n";
import { FilterMap, HvdCategoryMap } from "@/types/types";

import { FilterArea } from "./FilterArea";
import { FilterDateFilter } from "./filters/FilterDateFilter";
import { FilterGeoLocation } from "./filters/FilterGeoLocation";
import { FilterOrganization } from "./filters/FilterOrganization";

// map a facetlist with a displayName
const mapFacetList = (
  filter: FilterMap = { facetList: [] },
  facetNameToMap: (name: string) => string,
) => {
  return filter.facetList.map((facet) => ({
    ...facet,
    displayName: facetNameToMap(facet.name),
  }));
};

type FilterAreaFilterGroupsProps = FilterCommonConsumer & {
  /**
   * Backend-provided HVD category vocabulary; used to render human-readable labels for
   * the `hvd_categories` facet. Defaults to an empty map so that legacy callers keep
   * compiling — the facet labels then simply fall back to the raw URI.
   */
  hvdMap?: HvdCategoryMap;
};

export function FilterAreaFilterGroups({
  filterMap,
  hvdMap = {},
}: FilterAreaFilterGroupsProps) {
  const { t } = i18n;

  const groups = mapFacetList(filterMap.groups, (name) =>
    t("category.label." + name),
  );

  const licence = mapFacetList(filterMap.licence, (name) =>
    t("licenses::" + name),
  );

  const openness = mapFacetList(filterMap.openness, (name) =>
    t("filter.openness." + name),
  );

  const showcaseTypes = mapFacetList(filterMap.showcase_types, (name) =>
    t("filter.showcase_types." + name),
  );

  const platforms = mapFacetList(filterMap.platforms, (name) =>
    t("filter.platforms." + name),
  );

  const dataServices = mapFacetList(filterMap.dataservice, (name) =>
    t("filter.dataservice." + name),
  );

  const hvd = mapFacetList(filterMap.hvd, (name) => t("filter.hvd." + name));

  const hvdCategories = mapFacetList(filterMap.hvd_categories, (name) =>
    labelForHvdUri(name, hvdMap),
  );

  // these we dont map, so we take the name as is
  const { format, tags } = filterMap;

  if (Object.keys(filterMap).length === 0) {
    return null;
  }

  return (
    <FilterArea>
      <FilterCommon name="groups" facetList={groups} open />
      <FilterCommon name="format" facetList={format?.facetList || []} open />
      <FilterCommon name="licence" facetList={licence} visibleCount={5} />
      <FilterCommon name="openness" facetList={openness} visibleCount={5} />
      <FilterCommon name="showcase_types" facetList={showcaseTypes} />
      <FilterCommon name="platforms" facetList={platforms} visibleCount={5} />
      {filterMap.sourceportal && <FilterOrganization filterMap={filterMap} />}
      <FilterCommon name="tags" facetList={tags?.facetList || []} />
      <FilterCommon name="dataservice" facetList={dataServices} />
      <FilterCommon name="hvd" facetList={hvd} />
      <FilterCommon name="hvd_categories" facetList={hvdCategories} />
      <FilterGeoLocation filterMap={filterMap} />
      <FilterDateFilter filterMap={filterMap} />
    </FilterArea>
  );
}
