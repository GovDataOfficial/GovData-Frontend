import { icons, SVG } from "@/app/_components/SVG/SVG";
import { i18n } from "@/i18n";

export function ResourcePreviewError() {
  return (
    <div className="search-details-preview-error" role="alert">
      <SVG icon={icons.infoBlue} className="mx-1"></SVG>
      <span>{i18n.t("search.details.preview.error")}</span>
    </div>
  );
}
