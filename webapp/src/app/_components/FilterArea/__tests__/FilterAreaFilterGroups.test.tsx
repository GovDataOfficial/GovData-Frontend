import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { FilterAreaFilterGroups } from "@/app/_components/FilterArea";
import { HvdCategoryMap } from "@/types/types";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
}));

const HVD_URI = "http://data.europa.eu/bna/c_ac64a52d";

const hvdMap: HvdCategoryMap = {
  [HVD_URI]: {
    uri: HVD_URI,
    labelDe: "Georaum",
    labelEn: "Geospatial",
    parentUri: null,
    deprecated: false,
  },
};

describe("FilterAreaFilterGroups", () => {
  it("should render nothing if filtermap does not contain key", () => {
    const { container } = render(<FilterAreaFilterGroups filterMap={{}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should not render the hvd filter length is empty", () => {
    render(<FilterAreaFilterGroups filterMap={{ hvd: { facetList: [] } }} />);
    const hvdText = screen.queryByText("Hochwertige Datensätze");
    expect(hvdText).not.toBeInTheDocument();
  });

  it("should create the hvd filter", () => {
    render(
      <FilterAreaFilterGroups
        filterMap={{ hvd: { facetList: [{ name: "has_hvd", docCount: 1 }] } }}
      />,
    );
    const hvdText = screen.getByText("Hochwertige Datensätze");
    const link = screen.getByRole("link", {
      name: /nur hochwertige datensätze/i,
    });

    expect(hvdText).toBeInTheDocument();
    expect(link).toBeInTheDocument();
  });

  it("should resolve hvd_categories URIs to German labels via hvdMap", () => {
    render(
      <FilterAreaFilterGroups
        filterMap={{
          hvd_categories: { facetList: [{ name: HVD_URI, docCount: 3 }] },
        }}
        hvdMap={hvdMap}
      />,
    );

    expect(screen.getByText("Georaum")).toBeInTheDocument();
    expect(screen.queryByText(HVD_URI)).not.toBeInTheDocument();
  });

  it("should fall back to the raw URI when hvdMap is not provided", () => {
    render(
      <FilterAreaFilterGroups
        filterMap={{
          hvd_categories: { facetList: [{ name: HVD_URI, docCount: 3 }] },
        }}
      />,
    );

    expect(screen.getByText(HVD_URI)).toBeInTheDocument();
  });
});
