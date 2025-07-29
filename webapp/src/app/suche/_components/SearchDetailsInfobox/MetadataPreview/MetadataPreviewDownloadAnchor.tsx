import Image from "next/image";

import { icons } from "@/app/_components/SVG/iconMap";
import { MetadataPreviewFileSuffix } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewFileFormats";
import { i18n } from "@/i18n";

export type MetadataPreviewDownloadAnchor = {
  metadataName: string;
  backendUrl?: string;
};

function createCKANDatasetUrl(metadataName: string, backendUrl?: string) {
  try {
    const url = new URL(
      `${backendUrl}/${metadataName}.${MetadataPreviewFileSuffix.TURTLE}`,
    );
    return url.toString();
  } catch (e) {
    console.error("could not create ckan dataset url for", metadataName);
  }
  return "#";
}

export function MetadataPreviewDownloadAnchor({
  metadataName,
  backendUrl,
}: MetadataPreviewDownloadAnchor) {
  const { t } = i18n;
  return (
    <a
      className="d-flex"
      target="_blank"
      href={createCKANDatasetUrl(metadataName, backendUrl)}
    >
      <Image width={0} height={0} src={icons.icon_download} alt="" />
      {t("search.details.infobox.metaDataDownload.anchor")}
    </a>
  );
}
