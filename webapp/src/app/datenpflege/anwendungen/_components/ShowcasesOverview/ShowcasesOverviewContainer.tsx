"use client";

import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { Direction, useSortableData } from "@/app/_lib/hooks/useSortableData";
import { ShowcasesOverviewMobile } from "@/app/datenpflege/anwendungen/_components/ShowcasesOverview/ShowcasesOverviewMobile";
import { ShowcasesOverviewTable } from "@/app/datenpflege/anwendungen/_components/ShowcasesOverview/ShowcasesOverviewTable";
import {
  ShowcaseOption,
  ShowcaseRecord,
} from "@/app/datenpflege/anwendungen/_components/ShowcasesOverview/ShowcasesOverviewTypes";
import { i18n } from "@/i18n";

const sortDateString = (a: string, b: string, direction?: Direction) => {
  const aDate = new Date(a as string).getTime();
  const bDate = new Date(b as string).getTime();
  return direction === "ascending" ? aDate - bDate : bDate - aDate;
};

const showcaseOptions: ShowcaseOption[] = [
  {
    key: "title",
    labelKey: "showcasesoverview.table.title",
  },
  {
    key: "releaseDate",
    labelKey: "showcasesoverview.table.releaseDate",
    sort: sortDateString,
  },
  {
    key: "metadataModified",
    labelKey: "showcasesoverview.table.metadataModified",
    sort: sortDateString,
  },
];

export type ShowcasesOverviewContainer = {
  data: ShowcaseRecord[];
};

export function ShowcasesOverviewContainer({
  data,
}: ShowcasesOverviewContainer) {
  const { t } = i18n;
  const { sortByKeyAndDirection, sortedData, sortConfig } =
    useSortableData<ShowcaseRecord>(data, showcaseOptions, {
      key: "metadataModified",
      direction: "descending",
    });

  return (
    <div className="mt-10">
      <h2>{t("showcasesoverview.title")}</h2>
      <div className="d-none d-sm-block">
        <DesignBox>
          <ShowcasesOverviewTable
            data={sortedData}
            options={showcaseOptions}
            sortConfig={sortConfig}
            sortByKeyAndDirection={sortByKeyAndDirection}
          />
        </DesignBox>
      </div>
      <div className="d-sm-none">
        <ShowcasesOverviewMobile
          data={sortedData}
          options={showcaseOptions}
          sortConfig={sortConfig}
          sortByKeyAndDirection={sortByKeyAndDirection}
        />
      </div>
    </div>
  );
}
