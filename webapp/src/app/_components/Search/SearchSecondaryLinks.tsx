"use client";
import { i18n } from "@/i18n";
import { useSearchParams } from "next/navigation";
import { PAGES, URLHelper } from "@/app/_lib/URLHelper";

export function SearchSecondaryLinks() {
  const { t } = i18n;
  const searchParams = useSearchParams();
  const { createLinkToPageWithFilter } = URLHelper(searchParams);
  return (
    <>
      <div className="gd-search-searchbox-row-secondary">
        <a
          href={createLinkToPageWithFilter(PAGES.extendedSearch)}
          className="button-search button-search-secondary"
        >
          {t("search.link.extended.title")}
        </a>
      </div>
      <div className="gd-search-searchbox-row-secondary">
        <a
          href={createLinkToPageWithFilter(PAGES.geosearch)}
          className="button-search button-search-secondary"
        >
          {t("search.link.map.title")}
        </a>
      </div>
    </>
  );
}
