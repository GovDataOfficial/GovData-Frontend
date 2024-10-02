"use client";

import { useSearchParams } from "next/navigation";
import { PAGES, URLHelper } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";

export function ExtendedSearchLink({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const { createLinkToPageWithFilter } = URLHelper(searchParams);
  return (
    <div className={className}>
      <a
        href={createLinkToPageWithFilter(PAGES.extendedSearch)}
        className="d-inline-block"
      >
        {i18n.t("search.link.extended.title")}
      </a>
    </div>
  );
}
