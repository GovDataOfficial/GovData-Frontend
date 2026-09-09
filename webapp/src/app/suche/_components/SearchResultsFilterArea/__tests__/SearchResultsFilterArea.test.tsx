import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { SearchResultsFilterArea } from "@/app/suche/_components/SearchResultsFilterArea/SearchResultsFilterArea";
import {
  FilterMap,
  HvdCategoryMap,
  SearchResults,
  UnknownSearchResultHit,
} from "@/types/types";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
}));

vi.mock("@/app/_components/FilterArea/FilterAreaFilterGroups", () => ({
  FilterAreaFilterGroups: (props: {
    filterMap: FilterMap;
    hvdMap?: HvdCategoryMap;
  }) => (
    <div
      data-testid="filter-groups"
      data-hvd-uris={props.hvdMap ? Object.keys(props.hvdMap).join(",") : ""}
    />
  ),
}));

const HVD_URI = "http://data.europa.eu/bna/c_ac64a52d";

const data = {
  filterMap: {
    hvd_categories: { facetList: [{ name: HVD_URI, docCount: 3 }] },
  },
} as unknown as SearchResults<UnknownSearchResultHit>;

const hvdMap: HvdCategoryMap = {
  [HVD_URI]: {
    uri: HVD_URI,
    labelDe: "Georaum",
    labelEn: "Geospatial",
    parentUri: null,
    deprecated: false,
  },
};

describe("SearchResultsFilterArea", () => {
  it("passes hvdMap through to FilterAreaFilterGroups", () => {
    render(<SearchResultsFilterArea data={data} hvdMap={hvdMap} />);

    const filterGroups = screen.getAllByTestId("filter-groups");
    // Rendered twice: once inline, once via the OffCanvasPortal fallback (no target in JSDOM).
    expect(filterGroups.length).toBeGreaterThanOrEqual(1);
    for (const el of filterGroups) {
      expect(el.getAttribute("data-hvd-uris")).toBe(HVD_URI);
    }
  });

  it("renders without hvdMap (legacy callers)", () => {
    render(<SearchResultsFilterArea data={data} />);

    const filterGroups = screen.getAllByTestId("filter-groups");
    for (const el of filterGroups) {
      expect(el.getAttribute("data-hvd-uris")).toBe("");
    }
  });
});
