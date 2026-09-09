import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import { FALLBACK_HVD_CATEGORY_MAP } from "@/app/_lib/hvdCategories";
import { GroupedFilterMultiBox } from "@/app/erweitertesuche/inputs/GroupedFilterMultiBox";
import { HvdCategoryMap } from "@/types/types";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

const GEO = "http://data.europa.eu/bna/c_ac64a52d";
const MET = "http://data.europa.eu/bna/c_164e0bf5";
const GEO_SUB_ADDRESS = "http://data.europa.eu/bna/c_sub_addresses";
const GEO_SUB_BUILDING = "http://data.europa.eu/bna/c_sub_buildings";

const NESTED_MAP: HvdCategoryMap = {
  [GEO]: {
    uri: GEO,
    labelDe: "Georaum",
    labelEn: "Geospatial",
    parentUri: null,
    deprecated: false,
  },
  [MET]: {
    uri: MET,
    labelDe: "Meteorologie",
    labelEn: "Meteorological",
    parentUri: null,
    deprecated: false,
  },
  [GEO_SUB_ADDRESS]: {
    uri: GEO_SUB_ADDRESS,
    labelDe: "Adressen",
    labelEn: "Addresses",
    parentUri: GEO,
    deprecated: false,
  },
  [GEO_SUB_BUILDING]: {
    uri: GEO_SUB_BUILDING,
    labelDe: "Gebäude",
    labelEn: "Buildings",
    parentUri: GEO,
    deprecated: false,
  },
};

function withSearchParams(active: [string, string][]) {
  const params = new URLSearchParams();
  active.forEach(([key, value]) => params.append(key, value));
  vi.mocked(useSearchParams).mockReturnValue(params as ReadonlyURLSearchParams);
}

describe("GroupedFilterMultiBox", () => {
  it("renders an accordion per top-level with descendants underneath", () => {
    withSearchParams([]);
    render(<GroupedFilterMultiBox type="hvd_categories" map={NESTED_MAP} />);

    // Top-level checkbox exists for the Geospatial group
    const geoBox = screen.getByRole("checkbox", { name: "Georaum" });
    expect(geoBox).toHaveAttribute(
      "value",
      "http://data.europa.eu/bna/c_ac64a52d",
    );

    // Sub-categories rendered as checkboxes with URI values
    const addressBox = screen.getByRole("checkbox", { name: "Adressen" });
    expect(addressBox).toHaveAttribute("value", GEO_SUB_ADDRESS);

    const buildingBox = screen.getByRole("checkbox", { name: "Gebäude" });
    expect(buildingBox).toHaveAttribute("value", GEO_SUB_BUILDING);
  });

  it("marks checkboxes that match the active URL params", () => {
    withSearchParams([["hvd_categories", GEO_SUB_ADDRESS]]);
    render(<GroupedFilterMultiBox type="hvd_categories" map={NESTED_MAP} />);

    expect(
      (screen.getByRole("checkbox", { name: "Adressen" }) as HTMLInputElement)
        .checked,
    ).toBe(true);
    expect(
      (screen.getByRole("checkbox", { name: "Gebäude" }) as HTMLInputElement)
        .checked,
    ).toBe(false);
  });

  it("shows the active count in the accordion title", () => {
    withSearchParams([
      ["hvd_categories", GEO],
      ["hvd_categories", GEO_SUB_ADDRESS],
    ]);
    render(<GroupedFilterMultiBox type="hvd_categories" map={NESTED_MAP} />);

    // The Georaum group header should include the selected-count annotation
    const geoDetails = screen
      .getAllByRole("group")
      .find((el) => within(el).queryByText("Adressen") !== null);
    expect(geoDetails).toBeDefined();
    expect(within(geoDetails!).getByText(/2 ausgewählt/)).toBeInTheDocument();
  });

  it("falls back to a flat checkbox list when no sub-categories are present", () => {
    withSearchParams([]);
    const { container } = render(
      <GroupedFilterMultiBox
        type="hvd_categories"
        map={FALLBACK_HVD_CATEGORY_MAP}
      />,
    );

    // No accordions rendered — flat mode has no <details>/<summary>
    expect(container.querySelector("details")).toBeNull();
    expect(container.querySelector("summary")).toBeNull();

    // All six legacy top-level categories rendered as flat checkboxes
    expect(screen.getByRole("checkbox", { name: "Georaum" })).toBeDefined();
    expect(
      screen.getByRole("checkbox", { name: "Meteorologie" }),
    ).toBeDefined();
    expect(screen.getByRole("checkbox", { name: "Statistik" })).toBeDefined();
  });

  it("uses the URI as label when labelDe is null on top-level and descendants", () => {
    withSearchParams([]);
    const topNoLabel = "http://data.europa.eu/bna/c_top_no_label";
    const subNoLabel = "http://data.europa.eu/bna/c_sub_no_label";
    render(
      <GroupedFilterMultiBox
        type="hvd_categories"
        map={{
          [topNoLabel]: {
            uri: topNoLabel,
            labelDe: null,
            labelEn: null,
            parentUri: null,
            deprecated: false,
          },
          [subNoLabel]: {
            uri: subNoLabel,
            labelDe: null,
            labelEn: null,
            parentUri: topNoLabel,
            deprecated: false,
          },
        }}
      />,
    );

    expect(screen.getByRole("checkbox", { name: topNoLabel })).toHaveAttribute(
      "value",
      topNoLabel,
    );
    expect(screen.getByRole("checkbox", { name: subNoLabel })).toHaveAttribute(
      "value",
      subNoLabel,
    );
  });
});
