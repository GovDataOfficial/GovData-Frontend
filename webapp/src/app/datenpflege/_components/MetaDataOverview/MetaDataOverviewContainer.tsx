"use client";

import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { i18n } from "@/i18n";
import { MetaDataOverviewMobile } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewMobile";
import {
  MetaDataOption,
  MetaDataRecord,
} from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewTypes";
import { Direction, useSortableData } from "@/app/_lib/hooks/useSortableData";
import { MetaDataOverviewTable } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewTable";

const sortDateString = (a: string, b: string, direction?: Direction) => {
  const aDate = new Date(a as string).getTime();
  const bDate = new Date(b as string).getTime();
  return direction === "ascending" ? aDate - bDate : bDate - aDate;
};

const metaDataOptions: MetaDataOption[] = [
  {
    key: "title",
    labelKey: "metadataoverview.table.title",
  },
  {
    key: "created",
    labelKey: "metadataoverview.table.created",
    sort: sortDateString,
  },
  {
    key: "lastModified",
    labelKey: "metadataoverview.table.lastModified",
    sort: sortDateString,
  },
];

export type MetaDataOverviewContainer = {
  data: MetaDataRecord[];
};

export function MetaDataOverviewContainer({ data }: MetaDataOverviewContainer) {
  const { t } = i18n;
  const { sortByKeyAndDirection, sortedData, sortConfig } =
    useSortableData<MetaDataRecord>(data, metaDataOptions, {
      key: "title",
      direction: "ascending",
    });

  return (
    <div className="mt-10">
      <h2>{t("metadataoverview.title")}</h2>
      <div className="d-none d-sm-block">
        <DesignBox>
          <MetaDataOverviewTable
            data={sortedData}
            options={metaDataOptions}
            sortConfig={sortConfig}
            sortByKeyAndDirection={sortByKeyAndDirection}
          />
        </DesignBox>
      </div>
      <div className="d-sm-none">
        <MetaDataOverviewMobile
          data={sortedData}
          options={metaDataOptions}
          sortConfig={sortConfig}
          sortByKeyAndDirection={sortByKeyAndDirection}
        />
      </div>
    </div>
  );
}
