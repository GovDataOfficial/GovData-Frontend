import {
  FilterCommon,
  FilterCommonConsumer,
} from "@/app/_components/FilterArea/filters/FilterCommon";
import { fetchOrganizationSorted } from "@/app/_lib/getData";

export async function FilterOrganization({ filterMap }: FilterCommonConsumer) {
  const data = await fetchOrganizationSorted();

  const facetList = filterMap.sourceportal?.facetList.map((facet) => {
    const org = data?.find((item) => item.id === facet.name);
    return {
      ...facet,
      displayName: org?.displayName,
    };
  });

  return (
    <FilterCommon
      name={"sourceportal"}
      facetList={facetList || []}
      visibleCount={5}
    />
  );
}
