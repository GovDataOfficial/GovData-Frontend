import { memo } from "react";

import { TimeWithDate } from "@/app/_components/Time/TimeWithDate";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import { ShowcaseRecord } from "@/app/datenpflege/anwendungen/_components/ShowcasesOverview/ShowcasesOverviewTypes";
import { OverviewButtonDelete } from "@/app/datenpflege/common/OverviewButtonDelete";
import { OverviewButtonEdit } from "@/app/datenpflege/common/OverviewButtonEdit";
import { OverviewShowDetailsAnchor } from "@/app/datenpflege/common/OverviewShowDetailsAnchor";
import { i18n } from "@/i18n";

export type ShowcasesOverviewTableRow = {
  item: ShowcaseRecord;
};

export const ShowcasesOverviewTableRow = memo(
  function ShowcasesOverviewTableRow({ item }: ShowcasesOverviewTableRow) {
    return (
      <tr>
        <td>
          <a
            className="anchor-dark"
            href={PAGES_AUTH.manage_showcases_form_edit + "/" + item.id}
          >
            {item.title}
          </a>
        </td>
        <td>
          <TimeWithDate date={item.releaseDate} />
        </td>
        <td>
          <TimeWithDate date={item.metadataModified} />
        </td>
        <td>
          <div className="d-flex">
            <OverviewButtonEdit
              id={item.id.toString()}
              dataTitle={item.title}
              url={PAGES_AUTH.manage_showcases_form_edit}
            />
            <OverviewShowDetailsAnchor
              name={item.name}
              url={"suche/anwendung"}
            />
            <OverviewButtonDelete
              dataTitle={item.title}
              id={item.id.toString()}
              apiEndpoint={API_ENDPOINTS.SHOWCASES.DELETE}
              url={PAGES_AUTH.manage_showcases}
              deleteConfirmText={i18n.t(
                "showcasesoverview.table.delete.confirm",
                {
                  title: item.title,
                },
              )}
            />
          </div>
        </td>
      </tr>
    );
  },
);
