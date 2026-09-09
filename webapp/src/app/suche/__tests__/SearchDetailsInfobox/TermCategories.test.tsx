import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FILTERS } from "@/app/_lib/URLHelper";
import { TermCategories } from "@/app/suche/_components/SearchDetailsInfobox/partials/TermCategories";
import { HvdCategoryMap } from "@/types/types";

const GEO_URI = "http://data.europa.eu/bna/c_ac64a52d";

const HVD_MAP: HvdCategoryMap = {
  [GEO_URI]: {
    uri: GEO_URI,
    labelDe: "Georaum",
    labelEn: "Geospatial",
    parentUri: null,
    deprecated: false,
  },
};

describe("TermCategories", () => {
  it("renders null when categories are not provided", () => {
    const { container } = render(<TermCategories title="Test Title" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders null when categories are an empty array", () => {
    const { container } = render(
      <TermCategories title="Test Title" categories={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the title and category correctly", () => {
    const categories = ["ener"];
    render(<TermCategories title="Test Title" categories={categories} />);

    screen.getByText("Test Title");
    screen.getByText(/Energie/i);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining(FILTERS.GROUPS),
    );
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining(categories[0]),
    );
  });

  it("renders HVD category with backend label and URI-based filter link", () => {
    render(
      <TermCategories
        title="Test Title"
        categories={[GEO_URI]}
        isHVD={true}
        hvdMap={HVD_MAP}
      />,
    );
    screen.getByText("Georaum");
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining(FILTERS.HVD_CATEGORIES),
    );
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent(GEO_URI)),
    );
  });

  it("falls back to the URI when the HVD category is not in the vocabulary map", () => {
    const unknownUri = "http://data.europa.eu/bna/c_unknown-future";
    render(
      <TermCategories
        title="Test Title"
        categories={[unknownUri]}
        isHVD={true}
        hvdMap={HVD_MAP}
      />,
    );

    screen.getByText(unknownUri);
  });
});
