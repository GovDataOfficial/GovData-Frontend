import Image from "next/image";

import { icons } from "@/app/_components/SVG/iconMap";
import { i18n } from "@/i18n";
import { HitType } from "@/types/types";

type MetaInfoHeadlineIcon = {
  type: HitType;
};

const getIcon = (type: HitType) => {
  switch (type) {
    case HitType.dataset:
      return icons.mediatype_dataset;
    case HitType.showcase:
      return icons.mediatype_showcase;
    default:
      return icons.mediatype_dataset;
  }
};

export function MetaInfoHeadline({ type }: { type: HitType }) {
  const { t } = i18n;
  return (
    <span className="paragraph-small bold">{t("search.hit.type." + type)}</span>
  );
}

export function MetaInfoHeadlineIcon({ type }: MetaInfoHeadlineIcon) {
  const iconSrc = getIcon(type);
  return (
    <div className="metainfo">
      <div className={`mediatype-icon mediatype-${type} inverted`}>
        <Image width={0} height={0} src={iconSrc} alt="" />
      </div>
      <MetaInfoHeadline type={type} />
    </div>
  );
}
