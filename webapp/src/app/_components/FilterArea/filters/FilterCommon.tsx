"use client";

import { i18n } from "@/i18n";
import { FilterResultCount } from "@/app/_components/FilterArea/FilterResultCount";
import { useEffect, useMemo, useState } from "react";
import { SVG, icons } from "@/app/_components/SVG/SVG";
import { Accordion } from "@/app/_components/Accordion/Accordion";
import { useSearchParams } from "next/navigation";
import { RecordFilterMap } from "@/types/types";
import { URLHelper } from "@/app/_lib/URLHelper";
import { isNotNullOrUndefined } from "@/types/typeGuards";

export type FilterCommonConsumer = {
  filterMap: RecordFilterMap;
};

export type FilterCommonItem = {
  docCount: number;
  name: string;
  displayName?: string;
};

type FilterCommon = {
  name: string;
  facetList: FilterCommonItem[];
  open?: boolean;
  visibleCount?: number;
};

const createListItemId = (groupName: string, facetIndex: number) => {
  return `gd-filterarea-list-item-${groupName}-${facetIndex}`;
};

const focusFilterAreaListItem = (groupName: string, facetIndex: number) => {
  const listItemId = createListItemId(groupName, facetIndex);
  const listItem = document.querySelector<HTMLLIElement>(`#${listItemId} a`);

  if (listItem) {
    listItem.focus();
  }
};

const hitsMoreLimit = (data: any[], limit: number) => {
  return data.length > limit;
};

// hard coded sorting, groups currently only ones sorted by name
const sortFacets = (a: FilterCommonItem, b: FilterCommonItem, type: string) => {
  const hasDisplayName =
    isNotNullOrUndefined(a.displayName) && isNotNullOrUndefined(b.displayName);

  switch (true) {
    case type === "groups" && hasDisplayName:
      return a.displayName! > b.displayName! ? 1 : -1;
    case a.docCount === b.docCount && hasDisplayName:
      return a.displayName! > b.displayName! ? 1 : -1;
    case a.docCount === b.docCount && !hasDisplayName:
      return a.name > b.name ? 1 : -1;
    default:
      return a.docCount >= b.docCount ? -1 : 1;
  }
};

export function FilterCommon({
  name,
  facetList,
  open,
  visibleCount,
}: FilterCommon) {
  const { t } = i18n;
  const searchParams = useSearchParams();

  const { createLinkToSearchWithFilter, toggleParameter } =
    URLHelper(searchParams);

  const isMoreFilterActive = searchParams.has("more", name);
  const isOpenByUrl = searchParams.has(name);
  const isAccordionOpen = open || isMoreFilterActive || isOpenByUrl;
  const [more, setMore] = useState(isMoreFilterActive);

  const isShowMoreEnabled =
    visibleCount !== undefined &&
    !more &&
    hitsMoreLimit(facetList, visibleCount);

  const filteredFacetList = useMemo(() => {
    if (!visibleCount || more) {
      return facetList;
    }

    return facetList.filter((_, index) => index < visibleCount);
  }, [facetList, more, visibleCount]);

  useEffect(() => {
    if (more && typeof visibleCount == "number") {
      const firstNewItemIndex = filteredFacetList.length - visibleCount;

      if (typeof filteredFacetList[firstNewItemIndex] !== "undefined") {
        focusFilterAreaListItem(name, firstNewItemIndex);
      }
    }
  }, [more, filteredFacetList, visibleCount, name]);

  if (facetList.length === 0) {
    return null;
  }

  return (
    <Accordion title={t(`filter.${name}.title`)} open={isAccordionOpen}>
      <ul className="gd-filterarea-list">
        {filteredFacetList
          .sort((a, b) => sortFacets(a, b, name))
          .map((facet, index) => {
            const isActive = searchParams.has(name, facet.name);
            const id = createListItemId(name, index);
            return (
              <li id={id} key={id} className="gd-filterarea-list-item">
                <a
                  href={createLinkToSearchWithFilter(
                    name,
                    facet.name,
                    isActive,
                  )}
                  title={t(isActive ? "filter.deactivate" : "filter.activate")}
                  className={`gd-filterarea-link ${isActive ? "active" : ""}`}
                >
                  {isActive && (
                    <span className="offscreen">{t("filter.choosen")}</span>
                  )}
                  <div className="gd-filterarea-link-title">
                    {facet.displayName || facet.name}
                    {isActive && (
                      <SVG icon={icons.check} size="small" className="ml-2" />
                    )}
                  </div>
                  <FilterResultCount count={facet.docCount} />
                </a>
              </li>
            );
          })}
      </ul>
      {isShowMoreEnabled && (
        <a
          href={toggleParameter("more", name)}
          className="gd-filterarea-more"
          onClick={(e) => {
            e.preventDefault();
            setMore(true);
          }}
        >
          {t(`filter.showmore`)}
        </a>
      )}
    </Accordion>
  );
}
