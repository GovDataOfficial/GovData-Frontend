import { memo } from "react";

import { TimeWithDate } from "@/app/_components/Time/TimeWithDate";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import { OverviewButtonDelete } from "@/app/datenpflege/common/OverviewButtonDelete";
import { OverviewButtonEdit } from "@/app/datenpflege/common/OverviewButtonEdit";
import { OverviewShowDetailsAnchor } from "@/app/datenpflege/common/OverviewShowDetailsAnchor";
import { MetadataRecord } from "@/app/datenpflege/metadaten/_components/MetadataOverview/MetadataOverviewTypes";
import { i18n } from "@/i18n";

export type MetadataOverviewTableRow = {
  item: MetadataRecord;
};

export const MetadataOverviewTableRow = memo(function MetadataOverviewTableRow({
  item,
}: MetadataOverviewTableRow) {
  return (
    <tr>
      <td>
        <a
          className="anchor-dark"
          href={PAGES_AUTH.manage_metadata_form_edit + "/" + item.id}
        >
          {item.title}
        </a>
      </td>
      <td>
        <TimeWithDate date={item.created} />
      </td>
      <td>
        <TimeWithDate date={item.metadataModified} />
      </td>
      <td>
        <div className="d-flex">
          <OverviewButtonEdit
            id={item.id}
            dataTitle={item.title}
            url={PAGES_AUTH.manage_metadata_form_edit}
          />
          <OverviewShowDetailsAnchor name={item.name} url={"suche/daten"} />
          <OverviewButtonDelete
            dataTitle={item.title}
            id={item.id}
            apiEndpoint={API_ENDPOINTS.METADATA.DELETE}
            url={PAGES_AUTH.manage_metadata}
            deleteConfirmText={i18n.t("metadataoverview.table.delete.confirm", {
              title: item.title,
            })}
          />
        </div>
      </td>
    </tr>
  );
});
