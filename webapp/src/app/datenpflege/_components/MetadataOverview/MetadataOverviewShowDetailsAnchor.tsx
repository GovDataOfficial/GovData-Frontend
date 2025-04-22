import { icons, SVG } from "@/app/_components/SVG/SVG";
import { i18n } from "@/i18n";

type MetadataOverviewShowDetailsAnchor = {
  name: string;
};

export function MetadataOverviewShowDetailsAnchor({
  name,
}: MetadataOverviewShowDetailsAnchor) {
  return (
    <a
      href={`/suche/daten/${encodeURIComponent(name)}`}
      className="d-flex me-2"
      target="_blank"
    >
      {i18n.t("metadataoverview.table.show")}
      <SVG icon={icons.external_link} size="big" />
    </a>
  );
}
