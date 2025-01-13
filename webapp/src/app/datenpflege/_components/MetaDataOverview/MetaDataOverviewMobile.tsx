import {
  Direction,
  SortableData,
  SortConfig,
} from "@/app/_lib/hooks/useSortableData";
import { MetaDataOverviewMobileRow } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewMobileRow";
import { MetaDataOverviewMobileSort } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewMobileSort";
import {
  MetaDataOption,
  MetaDataRecord,
} from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewTypes";

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
  return (
    <>
      <MetaDataOverviewMobileSort
        sortConfig={sortConfig}
        sortByKeyAndDirection={sortByKeyAndDirection}
        options={options}
      />
      <ul className="gd-list">
        {data.map((d) => (
          <MetaDataOverviewMobileRow item={d} key={d.id} />
        ))}
      </ul>
    </>
  );
}
