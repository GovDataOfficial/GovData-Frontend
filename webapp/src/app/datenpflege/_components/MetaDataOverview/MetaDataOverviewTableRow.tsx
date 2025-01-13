import { memo } from "react";

import { TimeWithDate } from "@/app/_components/Time/TimeWithDate";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { MetaDataOverviewButtonDelete } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewButtonDelete";
import { MetaDataOverviewButtonEdit } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewButtonEdit";
import { MetaDataRecord } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewTypes";

export type MetaDataOverviewTableRow = {
  item: MetaDataRecord;
};

export const MetaDataOverviewTableRow = memo(function MetaDataOverviewTableRow({
  item,
}: MetaDataOverviewTableRow) {
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
          <MetaDataOverviewButtonEdit id={item.id} dataTitle={item.title} />
          <MetaDataOverviewButtonDelete dataTitle={item.title} id={item.id} />
        </div>
      </td>
    </tr>
  );
});
