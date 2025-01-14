import {
  Direction,
  SortableData,
  SortConfig,
} from "@/app/_lib/hooks/useSortableData";
import { MetadataOverviewMobileRow } from "@/app/datenpflege/_components/MetadataOverview/MetadataOverviewMobileRow";
import { MetadataOverviewMobileSort } from "@/app/datenpflege/_components/MetadataOverview/MetadataOverviewMobileSort";
import {
  MetadataOption,
  MetadataRecord,
} from "@/app/datenpflege/_components/MetadataOverview/MetadataOverviewTypes";

export type MetadataOverviewMobile = {
  data: MetadataRecord[];
  options: MetadataOption[];
  sortConfig?: SortConfig;
  sortByKeyAndDirection: (
    key: keyof SortableData,
    direction?: Direction,
  ) => void;
};
export function MetadataOverviewMobile({
  data,
  options,
  sortConfig,
  sortByKeyAndDirection,
}: MetadataOverviewMobile) {
  return (
    <>
      <MetadataOverviewMobileSort
        sortConfig={sortConfig}
        sortByKeyAndDirection={sortByKeyAndDirection}
        options={options}
      />
      <ul className="gd-list">
        {data.map((d) => (
          <MetadataOverviewMobileRow item={d} key={d.id} />
        ))}
      </ul>
    </>
  );
}
