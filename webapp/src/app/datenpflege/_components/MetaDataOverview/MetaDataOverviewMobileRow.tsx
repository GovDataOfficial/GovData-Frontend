import { memo } from "react";

import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { TimeWithDate } from "@/app/_components/Time/TimeWithDate";
import { MetaDataOverviewButtonDelete } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewButtonDelete";
import { MetaDataOverviewButtonEdit } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewButtonEdit";
import { MetaDataRecord } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewTypes";
import { i18n } from "@/i18n";

export type MetaDataOverviewMobileRow = {
  item: MetaDataRecord;
};

export const MetaDataOverviewMobileRow = memo(
  function MetaDataOverviewMobileRow({ item }: MetaDataOverviewMobileRow) {
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
            <MetaDataOverviewButtonEdit dataTitle={item.title} id={item.id} />
            <MetaDataOverviewButtonDelete dataTitle={item.title} id={item.id} />
          </div>
        </DesignBox>
      </li>
    );
  },
);
