"use client";

import { SortOptions } from "@/types/types";
import { i18n } from "@/i18n";
import { DropdownSelect } from "@/app/_components/Dropdown/DropdownSelect";
import { useSearchParams } from "next/navigation";
import { URLHelper } from "@/app/_lib/URLHelper";

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
