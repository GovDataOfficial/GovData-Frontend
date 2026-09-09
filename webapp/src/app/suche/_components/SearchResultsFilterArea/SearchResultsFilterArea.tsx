import { FilterAreaFilterGroups } from "@/app/_components/FilterArea/FilterAreaFilterGroups";
import { OffCanvasPortal } from "@/app/_components/OffCanvasMenu/OffCanvasPortal";
import { ExtendedSearchLink } from "@/app/suche/_components/common/ExtendedSearchLink";
import {
  HvdCategoryMap,
  SearchResults,
  UnknownSearchResultHit,
} from "@/types/types";

type SearchResultsFilterArea = {
  data: SearchResults<UnknownSearchResultHit>;
  hvdMap?: HvdCategoryMap;
};

export function SearchResultsFilterArea({
  data,
  hvdMap,
}: SearchResultsFilterArea) {
  const filterArea = (
    <FilterAreaFilterGroups filterMap={data.filterMap} hvdMap={hvdMap} />
  );

  return (
    <>
      <ExtendedSearchLink className="text-right mb-2" />
      {filterArea}
      <ExtendedSearchLink className="text-right mb-2" />
      <OffCanvasPortal>{filterArea}</OffCanvasPortal>
    </>
  );
}
