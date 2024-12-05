import { i18n } from "@/i18n";
import { MetaDataOverviewButtonDelete } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewButtonDelete";
import { MetaDataOverviewButtonEdit } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewButtonEdit";
import { TimeWithDate } from "@/app/_components/Time/TimeWithDate";
import {
  Direction,
  SortConfig,
  SortableData,
} from "@/app/_lib/hooks/useSortableData";
import {
  MetaDataRecord,
  MetaDataOption,
} from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewTypes";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";

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
            <tr key={row.id}>
              <td>
                <a
                  className="anchor-dark"
                  href={PAGES_AUTH.manage_data_form_edit + "/" + row.id}
                >
                  {row.title}
                </a>
              </td>
              <td>
                <TimeWithDate date={row.created} />
              </td>
              <td>
                <TimeWithDate date={row.lastModified} />
              </td>
              <td>
                <div className="d-flex">
                  <MetaDataOverviewButtonEdit
                    id={row.id}
                    dataTitle={row.title}
                  />
                  <MetaDataOverviewButtonDelete
                    dataTitle={row.title}
                    id={row.id}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
