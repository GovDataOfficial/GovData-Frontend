import { memo } from "react";

import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { TimeWithDate } from "@/app/_components/Time/TimeWithDate";
import { MetadataOverviewButtonDelete } from "@/app/datenpflege/_components/MetadataOverview/MetadataOverviewButtonDelete";
import { MetadataOverviewButtonEdit } from "@/app/datenpflege/_components/MetadataOverview/MetadataOverviewButtonEdit";
import { MetadataRecord } from "@/app/datenpflege/_components/MetadataOverview/MetadataOverviewTypes";
import { i18n } from "@/i18n";

export type MetadataOverviewMobileRow = {
  item: MetadataRecord;
};

export const MetadataOverviewMobileRow = memo(
  function MetadataOverviewMobileRow({ item }: MetadataOverviewMobileRow) {
    return (
      <li className="mt-2">
        <DesignBox>
          <dl className="gd-common-dl">
            <dt>{i18n.t("metadataoverview.table.title")}</dt>
            <dd>{item.title}</dd>
            <dt>{i18n.t("metadataoverview.table.created")}</dt>
            <dd>
              <TimeWithDate date={item.created} direction="row" />
            </dd>
            <dt>{i18n.t("metadataoverview.table.metadataModified")}</dt>
            <dd>
              <TimeWithDate date={item.metadataModified} direction="row" />
            </dd>
          </dl>
          <div className="d-flex mt-2">
            <span className="sr-only">
              {i18n.t("metadataoverview.table.actions")}
            </span>
            <MetadataOverviewButtonEdit dataTitle={item.title} id={item.id} />
            <MetadataOverviewButtonDelete dataTitle={item.title} id={item.id} />
          </div>
        </DesignBox>
      </li>
    );
  },
);
