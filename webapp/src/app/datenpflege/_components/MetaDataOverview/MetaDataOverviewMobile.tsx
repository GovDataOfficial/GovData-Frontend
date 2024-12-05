import { MetaDataOverviewMobileSort } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewMobileSort";
import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { MetaDataOverviewButtonDelete } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewButtonDelete";
import { MetaDataOverviewButtonEdit } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewButtonEdit";
import { i18n } from "@/i18n";
import { TimeWithDate } from "@/app/_components/Time/TimeWithDate";
import {
  MetaDataOption,
  MetaDataRecord,
} from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewTypes";
import {
  Direction,
  SortableData,
  SortConfig,
} from "@/app/_lib/hooks/useSortableData";

export type MetaDataOverviewMobile = {
  data: MetaDataRecord[];
  options: MetaDataOption[];
  sortConfig?: SortConfig;
  sortByKeyAndDirection: (
    key: keyof SortableData,
    direction?: Direction,
  ) => void;
};
export function MetaDataOverviewMobile({
  data,
  options,
  sortConfig,
  sortByKeyAndDirection,
}: MetaDataOverviewMobile) {
  const { t } = i18n;

  return (
    <>
      <MetaDataOverviewMobileSort
        sortConfig={sortConfig}
        sortByKeyAndDirection={sortByKeyAndDirection}
        options={options}
      />
      <ul className="gd-list">
        {data.map((d) => (
          <li key={d.id} className="mt-2">
            <DesignBox>
              <dl className="gd-common-dl">
                <dt>{t("metadataoverview.table.title")}</dt>
                <dd>{d.title}</dd>
                <dt>{t("metadataoverview.table.created")}</dt>
                <dd>
                  <TimeWithDate date={d.created} direction="row" />
                </dd>
                <dt>{t("metadataoverview.table.lastModified")}</dt>
                <dd>
                  <TimeWithDate date={d.lastModified} direction="row" />
                </dd>
              </dl>
              <div className="d-flex mt-2">
                <span className="sr-only">
                  {t("metadataoverview.table.actions")}
                </span>
                <MetaDataOverviewButtonEdit dataTitle={d.title} id={d.id} />
                <MetaDataOverviewButtonDelete dataTitle={d.title} id={d.id} />
              </div>
            </DesignBox>
          </li>
        ))}
      </ul>
    </>
  );
}
