"use client";

import { useSearchParams } from "next/navigation";

import { Accordion } from "@/app/_components/Accordion/Accordion";
import { FilterCommonConsumer } from "@/app/_components/FilterArea/filters/FilterCommon";
import { PAGES, URLHelper } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";
import { isNotNullOrUndefined } from "@/types/typeGuards";

export function FilterGeoLocation({ filterMap }: FilterCommonConsumer) {
  const searchParams = useSearchParams();
  const { createLinkToPageWithFilter } = URLHelper(searchParams);

  const isActive = isNotNullOrUndefined(filterMap.boundingbox);

  return (
    <Accordion
      title={<h3>{i18n.t("search.details.infobox.geoCoding")}</h3>}
      open
    >
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
