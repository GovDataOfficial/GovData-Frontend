"use client";

import { i18n } from "@/i18n";
import { SVG, icons } from "@/app/_components/SVG/SVG";
import { useSearchParams } from "next/navigation";
import { SPECIAL_FILTERS } from "@/app/_lib/URLHelper";

export function FilterAreaResetButton() {
  const searchParams = useSearchParams();
  const query = searchParams.get(SPECIAL_FILTERS.QUERY);
  let resetLink = "?";

  if (query) {
    resetLink += `${SPECIAL_FILTERS.QUERY}=${query}`;
  }

  return (
    <a href={resetLink} className="d-flex">
      <SVG className="gd-filterarea-icon" icon={icons.reset} />
      {i18n.t("search.results.filter.reset")}
    </a>
  );
}
