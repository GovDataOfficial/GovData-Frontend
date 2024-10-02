import { i18n } from "@/i18n";
import { NextJSSearchParams, SearchResults } from "@/types/types";
import { FilterResultCount } from "@/app/_components/FilterArea/FilterResultCount";
import { URLHelper } from "@/app/_lib/URLHelper";

type TypeListFilterItem = {
  facet: { name: string; docCount: number };
  searchParams: NextJSSearchParams;
};

function TypeListFilterItem({ facet, searchParams }: TypeListFilterItem) {
  const { name, docCount } = facet;
  const { getActiveTypeFromCurrentParams, createLinkToSearchWithType } =
    URLHelper(searchParams);

  const isSelected = getActiveTypeFromCurrentParams() === facet.name;
  const hasResults = docCount !== 0;

  const linkClass = ["gd-typelist-link"];
  isSelected && linkClass.push("selected");

  const text = (
    <>
      {i18n.t("filter.type." + facet.name)}
      <FilterResultCount count={docCount} />
    </>
  );

  if (!hasResults) {
    return (
      <li key={name} className={"gd-typelist-item no-results"}>
        <span className="gd-typelist-text">{text}</span>
      </li>
    );
  }

  return (
    <li key={name} className="gd-typelist-item">
      <a
        className={linkClass.join(" ")}
        href={createLinkToSearchWithType(facet.name)}
      >
        {text}
      </a>
    </li>
  );
}

export function TypeListFilter({
  data,
  searchParams,
}: {
  data: SearchResults;
  searchParams: NextJSSearchParams;
}) {
  if (!data.filterMap.type) {
    return null;
  }

  return (
    <>
      <h3 className="sr-only">Datentypen</h3>
      <ul className="gd-typelist d-sm-block">
        {data.filterMap.type.facetList.map((facet) => (
          <TypeListFilterItem
            key={facet.name}
            facet={facet}
            searchParams={searchParams}
          />
        ))}
      </ul>
    </>
  );
}
