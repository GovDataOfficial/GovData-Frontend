import {
  Direction,
  SortableData,
  SortConfig,
} from "@/app/_lib/hooks/useSortableData";
import { OverviewMobileSort } from "@/app/datenpflege/common/OverviewMobileSort";
import { MetadataOverviewMobileRow } from "@/app/datenpflege/metadaten/_components/MetadataOverview/MetadataOverviewMobileRow";
import {
  MetadataOption,
  MetadataRecord,
} from "@/app/datenpflege/metadaten/_components/MetadataOverview/MetadataOverviewTypes";

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
      <OverviewMobileSort
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
