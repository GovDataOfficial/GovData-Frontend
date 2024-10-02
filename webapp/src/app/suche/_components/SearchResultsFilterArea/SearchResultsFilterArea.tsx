import { SearchResults } from "@/types/types";
import { OffCanvasPortal } from "@/app/_components/OffCanvasMenu/OffCanvasPortal";
import { ExtendedSearchLink } from "@/app/suche/_components/common/ExtendedSearchLink";
import { FilterAreaFilterGroups } from "@/app/_components/FilterArea/FilterAreaFilterGroups";

type SearchResultsFilterArea = {
  data: SearchResults;
};

export function SearchResultsFilterArea({ data }: SearchResultsFilterArea) {
  const filterArea = <FilterAreaFilterGroups filterMap={data.filterMap} />;

  return (
    <>
      <ExtendedSearchLink className="text-right mb-2" />
      {filterArea}
      <ExtendedSearchLink className="text-right mb-2" />
      <OffCanvasPortal>{filterArea}</OffCanvasPortal>
    </>
  );
}
