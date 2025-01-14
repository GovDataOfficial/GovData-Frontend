import { FilterArea } from "@/app/_components/FilterArea/FilterArea";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { FILTERS, URLHelper } from "@/app/_lib/URLHelper";
import { ALL_PUBLISHERS } from "@/app/metadatenqualitaet/_components/Charts/common";
import { i18n } from "@/i18n";
import { MetadataQuality, NextJSSearchParams } from "@/types/types";

type MetadataQualityFilterArea = {
  data: MetadataQuality[];
  searchParams: NextJSSearchParams;
};

const isGovDataPublisher = (p: MetadataQuality) => {
  return p.publisherDisplayName?.toLowerCase() === ALL_PUBLISHERS.toLowerCase();
};

export function MetadataQualityFilterArea({
  data,
  searchParams,
}: MetadataQualityFilterArea) {
  const { isFilterActive } = URLHelper(searchParams);
  const unique: MetadataQuality[] = [];

  data.forEach((p) => {
    const hasPublisher = unique.some((up) => up.publisher === p.publisher);
    if (!isGovDataPublisher(p) && !hasPublisher) {
      unique.push(p);
    }
  });

  const publisherFilter = unique.map((publisher) => {
    const classes = ["gd-filterarea-link"];
    const isActive = isFilterActive(FILTERS.PUBLISHER, publisher.publisher);

    if (isActive) {
      classes.push("active");
    }

    return (
      <li
        className="gd-filterarea-list-item"
        key={publisher.name + publisher.publisher}
      >
        <a
          className={classes.join(" ")}
          href={"?publisher=" + publisher.publisher}
        >
          {isActive && (
            <span className="offscreen">{i18n.t("filter.choosen")}</span>
          )}
          <div className="gd-filterarea-link-title">
            {publisher.publisherDisplayName || publisher.publisher}
            {isActive && (
              <SVG icon={icons.check} size="small" className="ms-2" />
            )}
          </div>
        </a>
      </li>
    );
  });

  return (
    <FilterArea showResetBottomButton={false}>
      <ul className="gd-filterarea-list">{publisherFilter}</ul>
    </FilterArea>
  );
}
