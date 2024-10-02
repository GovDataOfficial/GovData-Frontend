import { MetaDataResource } from "@/types/types";

import { i18n } from "@/i18n";
import { InfoBadge } from "@/app/_components/InfoBadge/InfoBadge";
import {
  DtDescription,
  DtLicense,
  DtShortendAvailability,
} from "@/app/suche/_components/common/CommonDtDd";

export function ResourcesTableRowBottom({
  resource,
  open,
  available = true,
}: {
  resource: MetaDataResource;
  open: boolean;
  available: boolean;
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
        <dl className="gd-common-dl">
          <DtDescription
            term={i18n.t("search.details.accessService.description")}
            description={descriptionOnlyText}
          />
          <DtLicense license={license} />
          <DtShortendAvailability availability={shortendAvailability} />
        </dl>
      </td>
    </tr>
  );
}
