"use client";

import { Button } from "@/app/_components/Button/Button";
import { icons } from "@/app/_components/SVG/iconMap";
import { SVG } from "@/app/_components/SVG/SVG";
import { i18n } from "@/i18n";

export type MetadataPreviewDownloadButton = {
  onDownload: () => void;
  ref?: React.Ref<HTMLButtonElement>;
};

export function MetadataPreviewDownloadButton({
  onDownload,
  ref,
}: MetadataPreviewDownloadButton) {
  const { t } = i18n;

  return (
    <Button ref={ref} className="d-flex download-button" onClick={onDownload}>
      <SVG icon={icons.icon_download} />
      {t("search.details.infobox.metaDataDownload.modal.button")}
    </Button>
  );
}
