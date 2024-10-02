import { Tag } from "@/app/_components/Tag/Tag";
import { i18n } from "@/i18n";

type TagLicense = {
  open?: boolean;
};

export function TagLicense({ open }: TagLicense) {
  return (
    <Tag
      className="d-inline"
      variant={open ? "green" : "yellow"}
      title={i18n.t(`resources.table.panel.license.open.${open}.description`)}
    >
      {i18n.t(`resources.table.panel.license.open.${open}`)}
    </Tag>
  );
}
