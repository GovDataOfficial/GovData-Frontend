import { CategoryImage } from "@/app/_components/Categories/CategoryImage";
import { defaultHvdCategoriesData } from "@/app/_lib/defaultFormData";
import { FILTERS } from "@/app/_lib/URLHelper";
import { SearchDetailsInfoboxFilterTagAnchor } from "@/app/suche/_components/SearchDetailsInfobox/SearchDetailsInfoboxFilterTagAnchor";

type TermCategories = {
  isHVD?: boolean;
  categories?: string[];
  title: string;
};

const getCategoryValue = (isHVD: boolean, category: string) => {
  if (!isHVD) {
    return category;
  }
  return defaultHvdCategoriesData.find((c) => c.shortkey === category)?.key;
};

export function TermCategories({
  title,
  categories,
  isHVD = false,
}: TermCategories) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <>
      <dt>{title}</dt>
      {categories.map((category) => {
        const categoryValue = getCategoryValue(isHVD, category);
        return categoryValue ? (
          <dd key={category}>
            <SearchDetailsInfoboxFilterTagAnchor
              searchCriteria={isHVD ? FILTERS.HVD_CATEGORIES : FILTERS.GROUPS}
              searchCriteriaValue={categoryValue}
            >
              <CategoryImage type={category} />
            </SearchDetailsInfoboxFilterTagAnchor>
          </dd>
        ) : null;
      })}
    </>
  );
}
