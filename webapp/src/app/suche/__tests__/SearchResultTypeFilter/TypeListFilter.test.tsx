import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { isFeatureEnabled } from "@/app/_lib/features";
import { TypeListFilter } from "@/app/suche/_components/SearchResultTypeFilter/TypeListFilter";
import { Feature } from "@/configuration/featureFlags/types";
import {
  HitType,
  NextJSSearchParams,
  SearchResults,
  UnknownSearchResultHit,
} from "@/types/types";

vi.mock("@/app/_lib/features", () => ({
  isFeatureEnabled: vi.fn(),
}));

describe("TypeListFilter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isFeatureEnabled).mockReturnValue(true);
  });

  const createMockData = (
    typeList: Array<{ name: string; docCount: number }> = [],
  ) =>
    ({
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
          created: "2024-10-31T12:47:12",
          metadataModified: "2024-10-31T12:47:12",
        },
      ],
      filterMap: {
        licence: { facetList: [{ name: "cc-by", docCount: 2 }] },
        openness: { facetList: [{ name: "open", docCount: 2 }] },
        groups: { facetList: [{ name: "government", docCount: 2 }] },
        hvd: { facetList: [{ name: "true", docCount: 2 }] },
        format: { facetList: [{ name: "json", docCount: 2 }] },
        dataservice: { facetList: [{ name: "api", docCount: 2 }] },
        type: { facetList: typeList },
        showcase_types: { facetList: [{ name: "visualization", docCount: 2 }] },
        hvd_categories: { facetList: [{ name: "statistical", docCount: 2 }] },
        sourceportal: { facetList: [{ name: "govdata", docCount: 2 }] },
        tags: { facetList: [{ name: "open-data", docCount: 2 }] },
        platforms: { facetList: [{ name: "ckan", docCount: 2 }] },
      },
      hitsTotal: 2,
      cleanedActiveFilters: {},
    }) as SearchResults<UnknownSearchResultHit>;

  const mockSearchParams: NextJSSearchParams = {
    q: "test",
    type: "dataset",
  };

  describe("when type filterMap is not available", () => {
    it("should return null", () => {
      const dataWithoutType = createMockData();
      dataWithoutType.filterMap.type = undefined as any;

      const { container } = render(
        <TypeListFilter
          data={dataWithoutType}
          searchParams={mockSearchParams}
        />,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe("when type filterMap is available", () => {
    it("should render the component with correct structure", () => {
      const typeList = [
        { name: "dataset", docCount: 15 },
        { name: "article", docCount: 8 },
      ];
      const data = createMockData(typeList);

      render(<TypeListFilter data={data} searchParams={mockSearchParams} />);

      expect(
        screen.getByRole("heading", { name: /datentypen/i, level: 3 }),
      ).toBeInTheDocument();
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("should render all type items when showcases are enabled", () => {
      const typeList = [
        { name: "dataset", docCount: 15 },
        { name: "article", docCount: 8 },
        { name: HitType.showcase, docCount: 5 },
      ];
      const data = createMockData(typeList);

      render(<TypeListFilter data={data} searchParams={mockSearchParams} />);

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(3);
    });

    it("should filter out showcase type when showcasesEnabled feature is disabled", () => {
      vi.mocked(isFeatureEnabled).mockReturnValue(false);

      const typeList = [
        { name: "dataset", docCount: 15 },
        { name: "article", docCount: 8 },
        { name: HitType.showcase, docCount: 5 },
      ];
      const data = createMockData(typeList);

      render(<TypeListFilter data={data} searchParams={mockSearchParams} />);

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(2);

      // Verify showcase is not rendered
      expect(screen.queryByText(/showcase/i)).not.toBeInTheDocument();
    });

    it("should render items with results as links", () => {
      const typeList = [
        { name: "dataset", docCount: 15 },
        { name: "article", docCount: 8 },
      ];
      const data = createMockData(typeList);

      render(<TypeListFilter data={data} searchParams={mockSearchParams} />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);
    });

    it("should render items without results as plain text", () => {
      const typeList = [
        { name: "dataset", docCount: 15 },
        { name: "article", docCount: 0 }, // No results
      ];
      const data = createMockData(typeList);

      render(<TypeListFilter data={data} searchParams={mockSearchParams} />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(1); // Only dataset has results

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(2); // Both items rendered

      // Check that the no-results item has the correct class
      const noResultsItem = listItems.find((item) =>
        item.className.includes("no-results"),
      );
      expect(noResultsItem).toBeInTheDocument();
    });

    it("should show correct result counts", () => {
      const typeList = [
        { name: "dataset", docCount: 15 },
        { name: "article", docCount: 8 },
      ];
      const data = createMockData(typeList);

      render(<TypeListFilter data={data} searchParams={mockSearchParams} />);

      expect(screen.getByText("15")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
    });

    it("should apply selected class to active type", () => {
      const typeList = [
        { name: "dataset", docCount: 15 },
        { name: "article", docCount: 8 },
      ];
      const data = createMockData(typeList);
      const searchParamsWithDataset = { ...mockSearchParams, type: "dataset" };

      render(
        <TypeListFilter data={data} searchParams={searchParamsWithDataset} />,
      );

      const datasetLink = screen.getByRole("link", { name: /daten/i });
      expect(datasetLink).toHaveClass("selected");
    });

    it("should handle mixed case showcase type names when feature is enabled", () => {
      const typeList = [
        { name: "dataset", docCount: 15 },
        { name: "SHOWCASE", docCount: 5 }, // Uppercase
        { name: "Showcase", docCount: 3 }, // Mixed case
      ];
      const data = createMockData(typeList);

      render(<TypeListFilter data={data} searchParams={mockSearchParams} />);

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(3); // All items should be shown

      // Verify all showcase variations are rendered
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  describe("Feature flag integration", () => {
    it("should call isFeatureEnabled with correct feature flag", () => {
      const typeList = [{ name: HitType.showcase, docCount: 5 }];
      const data = createMockData(typeList);

      render(<TypeListFilter data={data} searchParams={mockSearchParams} />);

      expect(isFeatureEnabled).toHaveBeenCalledWith(Feature.showcasesEnabled);
    });

    it("should not call isFeatureEnabled when no showcase types are present", () => {
      const typeList = [
        { name: "dataset", docCount: 15 },
        { name: "article", docCount: 8 },
      ];
      const data = createMockData(typeList);

      render(<TypeListFilter data={data} searchParams={mockSearchParams} />);

      expect(isFeatureEnabled).not.toHaveBeenCalled();
    });
  });
});
