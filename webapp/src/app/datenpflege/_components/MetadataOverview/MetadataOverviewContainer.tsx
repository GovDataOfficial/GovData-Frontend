"use client";

import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { Direction, useSortableData } from "@/app/_lib/hooks/useSortableData";
import { MetadataOverviewMobile } from "@/app/datenpflege/_components/MetadataOverview/MetadataOverviewMobile";
import { MetadataOverviewTable } from "@/app/datenpflege/_components/MetadataOverview/MetadataOverviewTable";
import {
  MetadataOption,
  MetadataRecord,
} from "@/app/datenpflege/_components/MetadataOverview/MetadataOverviewTypes";
import { i18n } from "@/i18n";

const sortDateString = (a: string, b: string, direction?: Direction) => {
  const aDate = new Date(a as string).getTime();
  const bDate = new Date(b as string).getTime();
  return direction === "ascending" ? aDate - bDate : bDate - aDate;
};

const metadataOptions: MetadataOption[] = [
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
    key: "metadataModified",
    labelKey: "metadataoverview.table.metadataModified",
    sort: sortDateString,
  },
];

export type MetadataOverviewContainer = {
  data: MetadataRecord[];
};

export function MetadataOverviewContainer({ data }: MetadataOverviewContainer) {
  const { t } = i18n;
  const { sortByKeyAndDirection, sortedData, sortConfig } =
    useSortableData<MetadataRecord>(data, metadataOptions, {
      key: "metadataModified",
      direction: "descending",
    });

  return (
    <div className="mt-10">
      <h2>{t("metadataoverview.title")}</h2>
      <div className="d-none d-sm-block">
        <DesignBox>
          <MetadataOverviewTable
            data={sortedData}
            options={metadataOptions}
            sortConfig={sortConfig}
            sortByKeyAndDirection={sortByKeyAndDirection}
          />
        </DesignBox>
      </div>
      <div className="d-sm-none">
        <MetadataOverviewMobile
          data={sortedData}
          options={metadataOptions}
          sortConfig={sortConfig}
          sortByKeyAndDirection={sortByKeyAndDirection}
        />
      </div>
    </div>
  );
}
