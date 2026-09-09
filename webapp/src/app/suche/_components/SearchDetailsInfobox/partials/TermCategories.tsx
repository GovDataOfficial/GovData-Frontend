import { CategoryImage } from "@/app/_components/Categories/CategoryImage";
import { labelForHvdUri } from "@/app/_lib/hvdCategories";
import { FILTERS } from "@/app/_lib/URLHelper";
import { SearchDetailsInfoboxFilterTagAnchor } from "@/app/suche/_components/SearchDetailsInfobox/SearchDetailsInfoboxFilterTagAnchor";
import { HvdCategoryMap } from "@/types/types";

type TermCategories = {
  isHVD?: boolean;
  categories?: string[];
  title: string;
  /**
   * Backend-provided HVD vocabulary. Required only when `isHVD` is true; used to resolve
   * URI values to display labels (falls back to the URI when unknown).
   */
  hvdMap?: HvdCategoryMap;
};

export function TermCategories({
  title,
  categories,
  isHVD = false,
  hvdMap = {},
}: TermCategories) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <>
      <dt>{title}</dt>
      {categories.map((category) => (
        <dd key={category}>
          <SearchDetailsInfoboxFilterTagAnchor
            searchCriteria={isHVD ? FILTERS.HVD_CATEGORIES : FILTERS.GROUPS}
            searchCriteriaValue={category}
          >
            {isHVD ? (
              labelForHvdUri(category, hvdMap)
            ) : (
              <CategoryImage type={category} />
            )}
          </SearchDetailsInfoboxFilterTagAnchor>
        </dd>
      ))}
    </>
  );
}
