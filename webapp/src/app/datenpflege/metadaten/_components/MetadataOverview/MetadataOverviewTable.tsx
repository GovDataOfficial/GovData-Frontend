import {
  Direction,
  SortableData,
  SortConfig,
} from "@/app/_lib/hooks/useSortableData";
import { MetadataOverviewTableRow } from "@/app/datenpflege/metadaten/_components/MetadataOverview/MetadataOverviewTableRow";
import {
  MetadataOption,
  MetadataRecord,
} from "@/app/datenpflege/metadaten/_components/MetadataOverview/MetadataOverviewTypes";
import { i18n } from "@/i18n";

export type MetadataOverviewTable = {
  data: MetadataRecord[];
  options: MetadataOption[];
  sortConfig?: SortConfig;
  sortByKeyAndDirection: (
    key: keyof SortableData,
    direction?: Direction,
  ) => void;
};

const getSortDirection = (option: MetadataOption, sortConfig?: SortConfig) => {
  return option.key === sortConfig?.key ? sortConfig.direction : undefined;
};

export function MetadataOverviewTable({
  data,
  options,
  sortConfig,
  sortByKeyAndDirection,
}: MetadataOverviewTable) {
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
              {t("overview.table.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="td-width-50-15-15">
          {data.map((row) => (
            <MetadataOverviewTableRow key={row.id} item={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
