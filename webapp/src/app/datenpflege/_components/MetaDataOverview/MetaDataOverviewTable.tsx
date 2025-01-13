import {
  Direction,
  SortableData,
  SortConfig,
} from "@/app/_lib/hooks/useSortableData";
import { MetaDataOverviewTableRow } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewTableRow";
import {
  MetaDataOption,
  MetaDataRecord,
} from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewTypes";
import { i18n } from "@/i18n";

export type MetaDataOverviewTable = {
  data: MetaDataRecord[];
  options: MetaDataOption[];
  sortConfig?: SortConfig;
  sortByKeyAndDirection: (
    key: keyof SortableData,
    direction?: Direction,
  ) => void;
};

const getSortDirection = (option: MetaDataOption, sortConfig?: SortConfig) => {
  return option.key === sortConfig?.key ? sortConfig.direction : undefined;
};

export function MetaDataOverviewTable({
  data,
  options,
  sortConfig,
  sortByKeyAndDirection,
}: MetaDataOverviewTable) {
  const { t } = i18n;

  return (
    <div className="gd-table-wrapper">
      <table className="gd-table gd-table-with-divider">
        <caption className="sr-only">{t("metadataoverview.title")}</caption>
        <thead className="gd-table-head">
          <tr>
            {options.map((option) => {
              const sortDirection = getSortDirection(option, sortConfig);
              return (
                <th
                  aria-sort={sortDirection}
                  key={option.key}
                  className="text-nowrap text-left"
                >
                  <button
                    className={`gd-table-sort-button ${sortDirection ? sortDirection : ""}`}
                    onClick={() => sortByKeyAndDirection(option.key)}
                  >
                    <span>{t(option.labelKey)}</span>
                  </button>
                </th>
              );
            })}
            <th className="text-nowrap text-left">
              {t("metadataoverview.table.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="td-width-50-15-15">
          {data.map((row) => (
            <MetaDataOverviewTableRow key={row.id} item={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
