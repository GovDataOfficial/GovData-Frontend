"use client";

import { Accordion } from "@/app/_components/Accordion/Accordion";
import { useSearchParams } from "next/navigation";
import { PAGES, URLHelper } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";
import { FilterCommonConsumer } from "@/app/_components/FilterArea/filters/FilterCommon";
import { isNotNullOrUndefined } from "@/types/typeGuards";

export function FilterGeoLocation({ filterMap }: FilterCommonConsumer) {
  const searchParams = useSearchParams();
  const { createLinkToPageWithFilter } = URLHelper(searchParams);

  const isActive = isNotNullOrUndefined(filterMap.boundingbox);

  return (
    <Accordion title={i18n.t("search.details.infobox.geoCoding")} open>
      <a
        href={createLinkToPageWithFilter(PAGES.geosearch)}
        className="fnt-link"
      >
        {i18n.t(
          isActive ? "filter.geoLocation.change" : "filter.geoLocation.set",
        )}
      </a>
    </Accordion>
  );
}
