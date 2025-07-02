import { icons, SVG } from "@/app/_components/SVG/SVG";
import { i18n } from "@/i18n";

type OverviewShowDetailsAnchor = {
  name: string;
  url: string;
};

export function OverviewShowDetailsAnchor({
  name,
  url,
}: OverviewShowDetailsAnchor) {
  return (
    <a
      href={`/${url}/${encodeURIComponent(name)}`}
      className="d-flex me-2"
      target="_blank"
    >
      {i18n.t("overview.table.show")}
      <SVG icon={icons.external_link} size="big" />
    </a>
  );
}
