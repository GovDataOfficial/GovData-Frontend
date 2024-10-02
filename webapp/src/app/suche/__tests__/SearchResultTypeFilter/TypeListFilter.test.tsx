import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import { TypeListFilter } from "@/app/suche/_components/SearchResultTypeFilter/TypeListFilter";
import { NextJSSearchParams, SearchResults } from "@/types/types";

describe("TypeListFilter", () => {
  const mockedData = {
    scrollId: "testscrollid==",
    pageSize: 10,
    moreNextHitsAvailable: false,
    suggestions: [],
    hits: [
      {
        id: "378cfe96-7e97-4ccc-aa5f-2fde456a7900",
        name: "uber-test",
        type: "dataset",
        title: "Über Test",
        content: "asdasdas",
        lastModified: "2016-04-11T00:00:00",
        hasHvd: false,
      },
      {
        id: "7102da0d-ec99-4cec-8758-7ac9902c1e80",
        name: "schutzgebiete-test",
        type: "dataset",
        title: "Schutzgebiete - test",
        content: "sasdf",
        lastModified: "2019-07-11T12:37:03",
        hasHvd: false,
      },
    ],
    filterMap: {
      licence: { facetList: [{ name: "asd", docCount: 2 }] },
      openness: { facetList: [{ name: "asd", docCount: 2 }] },
      groups: { facetList: [{ name: "asd", docCount: 2 }] },
      hvd: { facetList: [{ name: "asd", docCount: 2 }] },
      format: { facetList: [{ name: "asd", docCount: 2 }] },
      dataservice: { facetList: [{ name: "asd", docCount: 2 }] },
      type: { facetList: [{ name: "asd", docCount: 2 }] },
      showcase_types: { facetList: [{ name: "asd", docCount: 2 }] },
      hvd_categories: { facetList: [{ name: "asd", docCount: 2 }] },
      sourceportal: { facetList: [{ name: "asd", docCount: 2 }] },
      tags: { facetList: [{ name: "asd", docCount: 2 }] },
      platforms: { facetList: [{ name: "asd", docCount: 2 }] },
    },
    hitsTotal: 2,
    cleanedActiveFilters: {},
  } as SearchResults;

  const mockedSearchParams = {
    q: "test",
    type: "dataset",
    filter: [
      "showcase_types:concept",
      "showcase_types:visualization",
      "groups:soci",
    ],
  } as NextJSSearchParams;

  ///@TODO implement Test
  it("should render correct", () => {
    render(
      <TypeListFilter data={mockedData} searchParams={mockedSearchParams} />,
    );
  });
});
