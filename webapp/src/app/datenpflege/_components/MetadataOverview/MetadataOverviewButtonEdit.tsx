import { icons, SVG } from "@/app/_components/SVG/SVG";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";

type MetadataOverviewButtonEdit = {
  id: string;
  dataTitle: string;
};
export function MetadataOverviewButtonEdit({
  id,
  dataTitle,
}: MetadataOverviewButtonEdit) {
  const { t } = i18n;

  return (
    <a
      title={dataTitle}
      className="d-flex me-2"
      href={PAGES_AUTH.manage_data_form_edit + "/" + id}
    >
      <SVG icon={icons.editPencil} size="big" />
      {t("metadataoverview.table.edit")}
    </a>
  );
}
