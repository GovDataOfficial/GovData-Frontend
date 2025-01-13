import { icons, SVG } from "@/app/_components/SVG/SVG";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";

type MetaDataOverviewButtonEdit = {
  id: string;
  dataTitle: string;
};
export function MetaDataOverviewButtonEdit({
  id,
  dataTitle,
}: MetaDataOverviewButtonEdit) {
  const { t } = i18n;

  return (
    <a
      title={dataTitle}
      className="fnt-link fnt-link-download me-2"
      href={PAGES_AUTH.manage_data_form_edit + "/" + id}
    >
      <SVG icon={icons.editPencil} size="big" />
      {t("metadataoverview.table.edit")}
    </a>
  );
}
