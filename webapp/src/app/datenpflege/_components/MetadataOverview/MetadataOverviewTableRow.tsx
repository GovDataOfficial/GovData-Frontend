import { memo } from "react";

import { TimeWithDate } from "@/app/_components/Time/TimeWithDate";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { MetadataOverviewButtonDelete } from "@/app/datenpflege/_components/MetadataOverview/MetadataOverviewButtonDelete";
import { MetadataOverviewButtonEdit } from "@/app/datenpflege/_components/MetadataOverview/MetadataOverviewButtonEdit";
import { MetadataOverviewShowDetailsAnchor } from "@/app/datenpflege/_components/MetadataOverview/MetadataOverviewShowDetailsAnchor";
import { MetadataRecord } from "@/app/datenpflege/_components/MetadataOverview/MetadataOverviewTypes";

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
          href={PAGES_AUTH.manage_data_form_edit + "/" + item.id}
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
          <MetadataOverviewButtonEdit id={item.id} dataTitle={item.title} />
          <MetadataOverviewShowDetailsAnchor name={item.name} />
          <MetadataOverviewButtonDelete dataTitle={item.title} id={item.id} />
        </div>
      </td>
    </tr>
  );
});
