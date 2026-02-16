import { icons, SVG } from "@/app/_components/SVG/SVG";
import { i18n } from "@/i18n";

type OverviewButtonEdit = {
  id: string;
  dataTitle: string;
  url: string;
};
export function OverviewButtonEdit({ id, dataTitle, url }: OverviewButtonEdit) {
  const { t } = i18n;

  return (
    <a title={dataTitle} className="d-flex me-2" href={`${url}/${id}`}>
      <SVG icon={icons.editPencil} size="big" className="primary" />
      {t("overview.table.edit")}
    </a>
  );
}
