import Image from "next/image";
import { i18n } from "@/i18n";
import { icons } from "@/app/_components/SVG/iconMap";

type MetaInfoHeadlineIcon = {
  type: string;
};

const knownTypes = [
  "dataset",
  "concept",
  "visualization",
  "mobile_app",
  "tool",
  "other",
  "website",
  "article",
  "blog",
];

const getMediaType = (type: string) => {
  const toLower = type.toLowerCase();
  return knownTypes.includes(toLower) ? toLower : "other";
};

const getIcon = (type: string) => {
  switch (type) {
    case "dataset":
      return icons.mediatype_dataset_inverted;
    case "concept":
      return icons.mediatype_typ_concept_inverted;
    case "visualization":
      return icons.mediatype_typ_visualization_inverted;
    case "mobile_app":
      return icons.mediatype_typ_mobile_app_inverted;
    case "tool":
      return icons.mediatype_typ_tool_inverted;
    case "website":
      return icons.mediatype_typ_website_inverted;
    case "article":
      return icons.mediatype_typ_article_inverted;
    case "blog":
      return icons.mediatype_typ_blog_inverted;
    default:
    case "other":
      return icons.mediatype_typ_other_inverted;
  }
};

export function MetaInfoHeadline({ type }: { type: string }) {
  const { t } = i18n;
  const mediaType = getMediaType(type);
  return (
    <span className="paragraph-small bold">
      {t("filter.showcase_types." + mediaType)}
    </span>
  );
}

export function MetaInfoHeadlineIcon({ type }: MetaInfoHeadlineIcon) {
  const mediaType = getMediaType(type);
  const iconSrc = getIcon(mediaType);
  return (
    <div className="metainfo">
      <div className={`mediatype-icon mediatype-${mediaType}`}>
        <Image width={0} height={0} src={iconSrc} alt="" />
      </div>
      <MetaInfoHeadline type={type} />
    </div>
  );
}
