import { i18n } from "@/i18n";
import {
  FilterCommon,
  FilterCommonConsumer,
} from "@/app/_components/FilterArea/filters/FilterCommon";
import { FilterMap } from "@/types/types";
import { FilterArea } from "./FilterArea";
import { findHvdCategory } from "@/app/_lib/hvdCategories";
import { FilterOrganization } from "./filters/FilterOrganization";
import { FilterGeoLocation } from "./filters/FilterGeoLocation";
import { FilterDateFilter } from "./filters/FilterDateFilter";

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

export function FilterAreaFilterGroups({ filterMap }: FilterCommonConsumer) {
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

  const hvdCategories = mapFacetList(
    filterMap.hvd_categories,
    (name) => findHvdCategory(name)?.label || name,
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
