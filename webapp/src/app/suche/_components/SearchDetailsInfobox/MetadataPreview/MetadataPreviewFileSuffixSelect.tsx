import { Select } from "@/app/_components/Inputs/Select";
import { MetadataPreviewFileSuffix } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewFileFormats";
import { i18n } from "@/i18n";

export type MetadataPreviewFileSuffixSelect = {
  fileSuffix: MetadataPreviewFileSuffix;
  onSuffixChange: (newSuffix: MetadataPreviewFileSuffix) => void;
};

export function MetadataPreviewFileSuffixSelect({
  fileSuffix,
  onSuffixChange,
}: MetadataPreviewFileSuffixSelect) {
  const { t } = i18n;

  return (
    <Select
      label={t("search.details.infobox.metaDataDownload.modal.format.label")}
      value={fileSuffix}
      onChange={(suffix: MetadataPreviewFileSuffix) => {
        onSuffixChange(suffix);
      }}
      className="file-suffix-select me-sm-2 mb-2 mb-sm-0"
    >
      {Object.values(MetadataPreviewFileSuffix).map((suffix) => (
        <option key={suffix} value={suffix}>
          {t(
            `search.details.infobox.metaDataDownload.modal.format.${suffix}.name`,
          )}
        </option>
      ))}
    </Select>
  );
}
