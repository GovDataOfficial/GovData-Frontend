import { InfoBadge } from "@/app/_components/InfoBoxes/InfoBadge";
import {
  DtDescription,
  DtLicense,
  DtShortendAvailability,
} from "@/app/suche/_components/common/CommonDtDd";
import { DtResourcePreview } from "@/app/suche/_components/ResourceTable/ResourcePreview/ResourcePreview";
import { i18n } from "@/i18n";
import { MetadataResource } from "@/types/types";

export function ResourcesTableRowBottom({
  metadataId,
  resource,
  open,
  available = true,
  tileUrl,
  previewRef,
}: {
  metadataId: string;
  resource: MetadataResource;
  open: boolean;
  available: boolean;
  tileUrl: string;
  previewRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { license, descriptionOnlyText, id, shortendAvailability } = resource;

  return (
    <tr className={`${open ? "" : "d-none"}`} id={id}>
      <td headers="th-title" colSpan={4} className="pt-0">
        {!available && (
          <InfoBadge className="mb-4">
            {i18n.t("resource.table.panel.unavailable")}
          </InfoBadge>
        )}
        {open && (
          <dl className="gd-common-dl">
            <DtDescription
              term={i18n.t("search.details.accessService.description")}
              description={descriptionOnlyText}
            />
            <DtResourcePreview
              metadataId={metadataId}
              resourceFormat={resource.formatShort}
              resourceUrl={resource.url}
              resourceId={resource.id}
              mobile={false}
              tileUrl={tileUrl}
              previewRef={previewRef}
            />
            <DtLicense license={license} />
            <DtShortendAvailability availability={shortendAvailability} />
          </dl>
        )}
      </td>
    </tr>
  );
}
