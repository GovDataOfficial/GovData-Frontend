import { memo } from "react";

import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { TimeWithDate } from "@/app/_components/Time/TimeWithDate";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import { ShowcaseRecord } from "@/app/datenpflege/anwendungen/_components/ShowcasesOverview/ShowcasesOverviewTypes";
import { OverviewButtonDelete } from "@/app/datenpflege/common/OverviewButtonDelete";
import { OverviewButtonEdit } from "@/app/datenpflege/common/OverviewButtonEdit";
import { OverviewShowDetailsAnchor } from "@/app/datenpflege/common/OverviewShowDetailsAnchor";
import { i18n } from "@/i18n";

export type ShowcasesOverviewMobileRow = {
  item: ShowcaseRecord;
};

export const ShowcasesOverviewMobileRow = memo(
  function ShowcasesOverviewMobileRow({ item }: ShowcasesOverviewMobileRow) {
    return (
      <li className="mt-2">
        <DesignBox>
          <dl className="gd-common-dl">
            <dt>{i18n.t("showcasesoverview.table.title")}</dt>
            <dd>{item.title}</dd>
            <dt>{i18n.t("showcasesoverview.table.releaseDate")}</dt>
            <dd>
              <TimeWithDate date={item.releaseDate} direction="row" />
            </dd>
            <dt>{i18n.t("showcasesoverview.table.metadataModified")}</dt>
            <dd>
              <TimeWithDate date={item.metadataModified} direction="row" />
            </dd>
          </dl>
          <div className="d-flex mt-2">
            <span className="sr-only">{i18n.t("overview.table.actions")}</span>
            <OverviewButtonEdit
              dataTitle={item.title}
              id={item.id.toString()}
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
        </DesignBox>
      </li>
    );
  },
);
