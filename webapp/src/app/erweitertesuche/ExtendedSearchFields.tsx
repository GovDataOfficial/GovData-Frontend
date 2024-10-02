"use client";

import { useEffect, useState } from "react";
import { FilterListItem } from "@/app/erweitertesuche/filter/FilterListItem";
import {
  defaultDataserviceData,
  defaultHvdCategoriesData,
  defaultHvdData,
  defaultOpennessData,
  defaultPlatformData,
  defaultShowcaseTypeData,
  defaultTypeData,
  normalizeData,
} from "@/app/_lib/defaultFormData";
import { i18n } from "@/i18n";
import { CommonSelect } from "@/app/erweitertesuche/inputs/CommonSelect";
import { CommonInputText } from "@/app/erweitertesuche/inputs/CommonInputText";
import { FilterTemporalCoverage } from "@/app/erweitertesuche/inputs/FilterTemporalCoverage";
import { FilterTags } from "@/app/erweitertesuche/inputs/FilterTags";
import { FilterMultiBox } from "@/app/erweitertesuche/inputs/FilterMultiBox";
import { Dropdown } from "@/app/_components/Dropdown/Dropdown";
import {
  CategoriesSorted,
  LicenseActiveSorted,
  NextJSSearchParams,
  OrganizationSorted,
  ResourceFormatsSorted,
  StateList,
} from "@/types/types";
import { convertToURLSearchParams } from "@/app/_lib/convertToSearchParams";

const filterItems: string[] = [
  "q",
  "temporal_coverage",
  "type",
  "openness",
  "licence",
  "sourceportal",
  "tags",
  "state",
  "title",
  "publisher",
  "maintainer",
  "notes",
  "groups",
  "format",
  "dataservice",
  "hvd",
  "hvd_categories",
  "platforms",
  "showcase_types",
];

type ExtendedSearchFields = {
  searchParams: NextJSSearchParams;
  stateList?: StateList;
  categoriesSorted?: CategoriesSorted;
  licenseActiveSorted?: LicenseActiveSorted;
  organizationSorted?: OrganizationSorted;
  resourceFormatsSorted?: ResourceFormatsSorted;
  filterTypes?: string;
};

export function ExtendedSearchFields({
  searchParams,
  stateList,
  categoriesSorted,
  licenseActiveSorted,
  organizationSorted,
  resourceFormatsSorted,
  filterTypes = "article,dataset,showcase", // no blogs currently
}: ExtendedSearchFields) {
  const urlSearchParams = convertToURLSearchParams(searchParams);
  const initialFilters = filterItems.filter((item) => {
    if (item === "temporal_coverage") {
      return urlSearchParams.get("start") || urlSearchParams.get("end");
    } else {
      return urlSearchParams.get(item);
    }
  });

  const [activeFilters, setActiveFilters] = useState<string[]>(initialFilters);
  const [userClicked, setUserClicked] = useState<boolean>();

  const addFilter = (filter: string) => {
    setActiveFilters((prevState) => [...prevState, filter]);
    setUserClicked(true);
  };

  const removeFilter = (filter: string) => {
    setActiveFilters((prevState) =>
      prevState.filter((item) => item !== filter),
    );
    setUserClicked(true);
  };

  // focus handling after used clicked and react mounted all elements
  useEffect(() => {
    if (userClicked) {
      const fieldList = document.querySelector("#fieldlist");
      const lastChild = fieldList?.lastElementChild;
      const inputTofocus = lastChild?.querySelector("input, select");

      if (inputTofocus) {
        (inputTofocus as HTMLElement).focus();
      } else {
        const button = document.querySelector(".gd-dropdown-toggle");
        (button as HTMLElement).focus();
      }
      setUserClicked(undefined);
    }
  }, [userClicked]);

  const orgData = normalizeData(organizationSorted, (item) => ({
    key: item.id,
    label: item.displayName,
  }));

  const stateData = normalizeData(stateList, (item) => ({
    key: item.id,
    label: item.name,
  }));

  const licenseData = normalizeData(licenseActiveSorted, (item) => ({
    key: item.id,
    label: item.title,
  }));

  const groupsData = normalizeData(categoriesSorted, (item) => ({
    key: item.name,
    label: item.displayName,
  }));

  const formatData = normalizeData(resourceFormatsSorted, (item) => ({
    key: item,
    label: item,
  }));

  const typeData = defaultTypeData.filter((defaultFilter) =>
    filterTypes.includes(defaultFilter.key),
  );

  function toFilterComponent(item: string) {
    switch (item) {
      case "temporal_coverage":
        return <FilterTemporalCoverage />;
      case "tags":
        return <FilterTags />;
      case "q":
      case "title":
      case "publisher":
      case "notes":
      case "maintainer":
        return <CommonInputText type={item} />;
      case "sourceportal":
        return <CommonSelect type={item} data={orgData} />;
      case "state":
        return <CommonSelect type={item} data={stateData} />;
      case "openness":
        return <CommonSelect type={item} data={defaultOpennessData} />;
      case "licence":
        return <CommonSelect type={item} data={licenseData} />;
      case "type":
        return <CommonSelect type={item} data={typeData} />;
      case "platforms":
        return <FilterMultiBox type={item} data={defaultPlatformData} />;
      case "format":
        return <FilterMultiBox type={item} data={formatData} />;
      case "showcase_types":
        return <FilterMultiBox type={item} data={defaultShowcaseTypeData} />;
      case "groups":
        return <FilterMultiBox type={item} data={groupsData} />;
      case "hvd":
        return <FilterMultiBox type={item} data={defaultHvdData} />;
      case "hvd_categories":
        return <FilterMultiBox type={item} data={defaultHvdCategoriesData} />;
      case "dataservice":
        return <FilterMultiBox type={item} data={defaultDataserviceData} />;
      default:
        return null;
    }
  }

  const options = filterItems.filter((item) => !activeFilters.includes(item));

  return (
    <form
      action="/suche"
      method="get"
      encType="application/x-www-form-urlencoded"
      onReset={() => {
        if (confirm(i18n.t("search.extended.reset.confirm"))) {
          setActiveFilters([]);
        }
      }}
    >
      {activeFilters.length > 0 && (
        <ul className="row list-unstyled" id="fieldlist">
          {activeFilters.map((filter) => (
            <FilterListItem key={filter} type={filter} onClick={removeFilter}>
              {toFilterComponent(filter)}
            </FilterListItem>
          ))}
        </ul>
      )}

      <div className="searchext-modbuttons-container">
        <div className="searchext-modbutton">
          <Dropdown
            options={options}
            title={i18n.t("search.extended.field.add")}
          >
            {(item) => (
              <button type="button" onClick={() => addFilter(item)}>
                {i18n.t("filter." + item + ".extended.title")}
              </button>
            )}
          </Dropdown>
        </div>
        <div className="searchext-modbutton">
          <button
            type="reset"
            className="button-search"
            disabled={activeFilters.length === 0}
          >
            {i18n.t("search.extended.field.reset")}
          </button>
        </div>
        <div className="searchext-modbutton">
          <button type="submit" className="button-search">
            {i18n.t("search.extended.field.submit")}
          </button>
        </div>
      </div>
    </form>
  );
}
