import {
  Direction,
  SortableData,
  SortConfig,
} from "@/app/_lib/hooks/useSortableData";
import { ShowcasesOverviewMobileRow } from "@/app/datenpflege/anwendungen/_components/ShowcasesOverview/ShowcasesOverviewMobileRow";
import {
  ShowcaseOption,
  ShowcaseRecord,
} from "@/app/datenpflege/anwendungen/_components/ShowcasesOverview/ShowcasesOverviewTypes";
import { OverviewMobileSort } from "@/app/datenpflege/common/OverviewMobileSort";

export type ShowcasesOverviewMobile = {
  data: ShowcaseRecord[];
  options: ShowcaseOption[];
  sortConfig?: SortConfig;
  sortByKeyAndDirection: (
    key: keyof SortableData,
    direction?: Direction,
  ) => void;
};
export function ShowcasesOverviewMobile({
  data,
  options,
  sortConfig,
  sortByKeyAndDirection,
}: ShowcasesOverviewMobile) {
  return (
    <>
      <OverviewMobileSort
        sortConfig={sortConfig}
        sortByKeyAndDirection={sortByKeyAndDirection}
        options={options}
      />
      <ul className="gd-list">
        {data.map((d) => (
          <ShowcasesOverviewMobileRow item={d} key={d.id} />
        ))}
      </ul>
    </>
  );
}
