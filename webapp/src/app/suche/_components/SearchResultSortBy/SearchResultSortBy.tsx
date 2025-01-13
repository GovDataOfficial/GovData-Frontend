"use client";

import { useSearchParams } from "next/navigation";

import { DropdownSelect } from "@/app/_components/Dropdown/DropdownSelect";
import { URLHelper } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";
import { SortOptions } from "@/types/types";

export function SearchResultSortBy() {
  const { t } = i18n;
  const searchParams = useSearchParams();
  const { createLinkToSearchWithSort, getActiveSortFromCurrentParams } =
    URLHelper(searchParams);

  return (
    <DropdownSelect
      options={SortOptions}
      title={t("search.sortby." + getActiveSortFromCurrentParams())}
      label={t("search.sortby.title")}
    >
      {(type) => (
        <a href={createLinkToSearchWithSort(type)}>
          {t("search.sortby." + type)}
        </a>
      )}
    </DropdownSelect>
  );
}
