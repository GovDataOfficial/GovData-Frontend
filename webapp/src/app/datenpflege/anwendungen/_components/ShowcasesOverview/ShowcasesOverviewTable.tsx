import {
  Direction,
  SortableData,
  SortConfig,
} from "@/app/_lib/hooks/useSortableData";
import { ShowcasesOverviewTableRow } from "@/app/datenpflege/anwendungen/_components/ShowcasesOverview/ShowcasesOverviewTableRow";
import {
  ShowcaseOption,
  ShowcaseRecord,
} from "@/app/datenpflege/anwendungen/_components/ShowcasesOverview/ShowcasesOverviewTypes";
import { i18n } from "@/i18n";

export type ShowcasesOverviewTable = {
  data: ShowcaseRecord[];
  options: ShowcaseOption[];
  sortConfig?: SortConfig;
  sortByKeyAndDirection: (
    key: keyof SortableData,
    direction?: Direction,
  ) => void;
};

const getSortDirection = (option: ShowcaseOption, sortConfig?: SortConfig) => {
  return option.key === sortConfig?.key ? sortConfig.direction : undefined;
};

export function ShowcasesOverviewTable({
  data,
  options,
  sortConfig,
  sortByKeyAndDirection,
}: ShowcasesOverviewTable) {
  const { t } = i18n;

  return (
    <div className="gd-table-wrapper">
      <table className="gd-table gd-table-with-divider">
        <caption className="sr-only">{t("showcasesoverview.title")}</caption>
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
            <ShowcasesOverviewTableRow key={row.id} item={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
