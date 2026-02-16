import { ButtonIcon } from "@/app/_components/Button/ButtonIcon";
import { icons } from "@/app/_components/SVG/iconMap";
import { i18n } from "@/i18n";
import { ResourceFormatShort } from "@/types/types";

export const getIconForPreview = (formatShort: string) => {
  switch (formatShort.toLowerCase()) {
    case ResourceFormatShort.geojson:
      return icons.mapMarker;
    default:
      return undefined;
  }
};

export type ResourcePreviewIcon = {
  formatShort: string;
  onClick: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>,
  ) => void;
  className?: string;
};

export function ResourcePreviewIcon({
  formatShort,
  onClick,
  className = "",
}: ResourcePreviewIcon) {
  const icon = getIconForPreview(formatShort);
  if (!icon) {
    return null;
  }
  return (
    <ButtonIcon
      onClick={onClick}
      title={i18n.t("search.details.preview.tooltip")}
      className={`gd-button-icon-tertiary inverted ${className}`}
      icon={icon}
      size="big"
      tooltipPlacement="bottom"
    />
  );
}
