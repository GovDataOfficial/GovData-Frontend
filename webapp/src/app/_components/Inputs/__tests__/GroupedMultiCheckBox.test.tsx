import { describe, expect, it } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { GroupedMultiCheckBox } from "@/app/_components/Inputs/GroupedMultiCheckBox";
import { FALLBACK_HVD_CATEGORY_MAP } from "@/app/_lib/hvdCategories";
import { HvdCategoryMap } from "@/types/types";

const GEO = "http://data.europa.eu/bna/c_ac64a52d";
const MET = "http://data.europa.eu/bna/c_164e0bf5";
const GEO_ADDRESSES = "http://data.europa.eu/bna/c_sub_addresses";
const GEO_BUILDINGS = "http://data.europa.eu/bna/c_sub_buildings";

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
  [GEO_ADDRESSES]: {
    uri: GEO_ADDRESSES,
    labelDe: "Adressen",
    labelEn: "Addresses",
    parentUri: GEO,
    deprecated: false,
  },
  [GEO_BUILDINGS]: {
    uri: GEO_BUILDINGS,
    labelDe: "Gebäude",
    labelEn: "Buildings",
    parentUri: GEO,
    deprecated: false,
  },
};

describe("GroupedMultiCheckBox", () => {
  it("renders one checkbox per top-level and per descendant", () => {
    render(
      <GroupedMultiCheckBox
        name="hvd_categories"
        hvdMap={NESTED_MAP}
        legend="HVD Kategorien"
      />,
    );

    const geo = screen.getByRole("checkbox", { name: "Georaum" });
    expect(geo).toHaveAttribute("value", GEO);
    expect((geo as HTMLInputElement).name).toBe("hvd_categories");

    expect(screen.getByRole("checkbox", { name: "Adressen" })).toHaveAttribute(
      "value",
      GEO_ADDRESSES,
    );
    expect(screen.getByRole("checkbox", { name: "Gebäude" })).toBeDefined();
    expect(
      screen.getByRole("checkbox", { name: "Meteorologie" }),
    ).toBeDefined();
  });

  it("pre-checks defaultChecked URIs", () => {
    render(
      <GroupedMultiCheckBox
        name="hvd_categories"
        hvdMap={NESTED_MAP}
        defaultChecked={[GEO_ADDRESSES]}
        legend="HVD Kategorien"
      />,
    );

    expect(
      (screen.getByRole("checkbox", { name: "Adressen" }) as HTMLInputElement)
        .checked,
    ).toBe(true);
    expect(
      (screen.getByRole("checkbox", { name: "Gebäude" }) as HTMLInputElement)
        .checked,
    ).toBe(false);
  });

  it("auto-opens the enclosing accordion group when a descendant is pre-checked", () => {
    const { container } = render(
      <GroupedMultiCheckBox
        name="hvd_categories"
        hvdMap={NESTED_MAP}
        defaultChecked={[GEO_ADDRESSES]}
        legend="HVD Kategorien"
      />,
    );

    // Find the <details> whose <summary> contains "Georaum" and assert it is open
    const detailsList = Array.from(
      container.querySelectorAll("details"),
    ) as HTMLDetailsElement[];
    const geoDetails = detailsList.find((d) =>
      d.querySelector("summary")?.textContent?.includes("Georaum"),
    );
    expect(geoDetails?.open).toBe(true);

    const metDetails = detailsList.find((d) =>
      d.querySelector("summary")?.textContent?.includes("Meteorologie"),
    );
    expect(metDetails?.open).toBe(false);
  });

  it("shows the selected-count annotation in the accordion title", () => {
    render(
      <GroupedMultiCheckBox
        name="hvd_categories"
        hvdMap={NESTED_MAP}
        defaultChecked={[GEO, GEO_ADDRESSES]}
        legend="HVD Kategorien"
      />,
    );

    const geoGroup = screen
      .getAllByRole("group")
      .find((el) => within(el).queryByText("Adressen") !== null);
    expect(geoGroup).toBeDefined();
    expect(within(geoGroup!).getByText(/2 ausgewählt/)).toBeInTheDocument();
  });

  it("degrades to a flat checkbox list when the map has no sub-categories", () => {
    const { container } = render(
      <GroupedMultiCheckBox
        name="hvd_categories"
        hvdMap={FALLBACK_HVD_CATEGORY_MAP}
        legend="HVD Kategorien"
      />,
    );

    expect(container.querySelector("details")).toBeNull();
    expect(screen.getByRole("checkbox", { name: "Georaum" })).toBeDefined();
    expect(
      screen.getByRole("checkbox", { name: "Meteorologie" }),
    ).toBeDefined();
    expect(screen.getByRole("checkbox", { name: "Statistik" })).toBeDefined();
  });

  it("renders no checkboxes for an empty map", () => {
    render(
      <GroupedMultiCheckBox
        name="hvd_categories"
        hvdMap={{}}
        legend="HVD Kategorien"
      />,
    );

    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
  });

  it("preserves defaultChecked URIs not present in the vocabulary as hidden inputs so save cannot silently drop them", () => {
    // Simulates the degraded-vocabulary case from BUG-HVD-VERLUST-DATENPFLEGE:
    // the dataset carries a sub-category URI, but the vocabulary in effect only
    // contains the six top-levels (fallback). Without preservation the POST would
    // wipe the sub-category because there is no checkbox to submit its value.
    const orphanUri = "http://data.europa.eu/bna/c_sub_addresses";
    const { container } = render(
      <GroupedMultiCheckBox
        name="hvd_categories"
        hvdMap={FALLBACK_HVD_CATEGORY_MAP}
        defaultChecked={[GEO, orphanUri]}
        legend="HVD Kategorien"
      />,
    );

    // Top-level is a real checkbox
    const geoBox = screen.getByRole("checkbox", {
      name: "Georaum",
    }) as HTMLInputElement;
    expect(geoBox.checked).toBe(true);

    // Sub-category has no checkbox
    expect(
      screen.queryByRole("checkbox", { name: orphanUri }),
    ).not.toBeInTheDocument();

    // ...but is present as a hidden input under the same field name so it survives submit
    const hidden = container.querySelector<HTMLInputElement>(
      `input[type="hidden"][name="hvd_categories"]`,
    );
    expect(hidden).not.toBeNull();
    expect(hidden!.value).toBe(orphanUri);
  });

  it("dedupes defaultChecked so duplicates do not create duplicate hidden inputs or inflate the validation counter", () => {
    // Dataset payloads occasionally repeat URIs. Without dedupe: (a) two hidden inputs
    // with the same React key would warn and submit the URI twice; (b) initialSelectedCount
    // would count the duplicate and required-validation would think the field is
    // "more filled" than it is.
    const orphan = "http://data.europa.eu/bna/c_sub_addresses";
    const { container } = render(
      <GroupedMultiCheckBox
        name="hvd_categories"
        hvdMap={FALLBACK_HVD_CATEGORY_MAP}
        defaultChecked={[GEO, GEO, orphan, orphan]}
        legend="HVD Kategorien"
        required
      />,
    );

    const hiddenValues = Array.from(
      container.querySelectorAll<HTMLInputElement>(
        `input[type="hidden"][name="hvd_categories"]`,
      ),
    ).map((el) => el.value);
    expect(hiddenValues).toEqual([orphan]);

    // With 2 unique items pre-checked, required-validation must already pass on mount
    const geoBox = screen.getByRole("checkbox", {
      name: "Georaum",
    }) as HTMLInputElement;
    expect(geoBox.validationMessage).toBe("");
  });

  it("preserves every defaultChecked URI when the vocabulary is empty", () => {
    const uris = [
      "http://data.europa.eu/bna/c_ac64a52d",
      "http://data.europa.eu/bna/c_sub_addresses",
    ];
    const { container } = render(
      <GroupedMultiCheckBox
        name="hvd_categories"
        hvdMap={{}}
        defaultChecked={uris}
        legend="HVD Kategorien"
      />,
    );

    const hiddenValues = Array.from(
      container.querySelectorAll<HTMLInputElement>(
        `input[type="hidden"][name="hvd_categories"]`,
      ),
    ).map((el) => el.value);
    expect(hiddenValues.sort()).toEqual([...uris].sort());
  });

  it("marks the legend with a required indicator when required is set", () => {
    const { container, rerender } = render(
      <GroupedMultiCheckBox
        name="hvd_categories"
        hvdMap={NESTED_MAP}
        legend="HVD Kategorien"
        required
      />,
    );

    expect(
      within(container.querySelector("legend")!).getByText("*"),
    ).toBeInTheDocument();

    rerender(
      <GroupedMultiCheckBox
        name="hvd_categories"
        hvdMap={NESTED_MAP}
        legend="HVD Kategorien"
      />,
    );

    expect(
      within(container.querySelector("legend")!).queryByText("*"),
    ).not.toBeInTheDocument();
  });

  it("renders the recommended annotation when recommended is set", () => {
    const { container, rerender } = render(
      <GroupedMultiCheckBox
        name="hvd_categories"
        hvdMap={NESTED_MAP}
        legend="HVD Kategorien"
        recommended
      />,
    );

    expect(
      within(container.querySelector("legend")!).getByText("(empfohlen)"),
    ).toBeInTheDocument();

    rerender(
      <GroupedMultiCheckBox
        name="hvd_categories"
        hvdMap={NESTED_MAP}
        legend="HVD Kategorien"
      />,
    );

    expect(
      within(container.querySelector("legend")!).queryByText("(empfohlen)"),
    ).not.toBeInTheDocument();
  });

  it("blocks form submission via setCustomValidity until at least one checkbox is checked (required)", async () => {
    const user = userEvent.setup();
    render(
      <GroupedMultiCheckBox
        name="hvd_categories"
        hvdMap={NESTED_MAP}
        legend="HVD Kategorien"
        required
      />,
    );

    // useCheckboxGroup wires setElementRef to the first mounted checkbox — with
    // NESTED_MAP that is Georaum. Nothing checked ⇒ browser validation blocks submit.
    const geoBox = screen.getByRole("checkbox", {
      name: "Georaum",
    }) as HTMLInputElement;
    expect(geoBox.validationMessage).toBe(
      "Bitte wählen Sie mindestens eine Option aus.",
    );

    await act(() => user.click(geoBox));

    expect(geoBox.validationMessage).toBe("");

    await act(() => user.click(geoBox));

    expect(geoBox.validationMessage).toBe(
      "Bitte wählen Sie mindestens eine Option aus.",
    );
  });

  it("counts pre-checked items so a required group with defaultChecked passes validation on mount", () => {
    render(
      <GroupedMultiCheckBox
        name="hvd_categories"
        hvdMap={NESTED_MAP}
        legend="HVD Kategorien"
        required
        defaultChecked={[GEO_ADDRESSES]}
      />,
    );

    const geoBox = screen.getByRole("checkbox", {
      name: "Georaum",
    }) as HTMLInputElement;
    expect(geoBox.validationMessage).toBe("");
  });

  it("does not enforce a minimum selection when required is not set", () => {
    render(
      <GroupedMultiCheckBox
        name="hvd_categories"
        hvdMap={NESTED_MAP}
        legend="HVD Kategorien"
      />,
    );

    const geoBox = screen.getByRole("checkbox", {
      name: "Georaum",
    }) as HTMLInputElement;
    expect(geoBox.validationMessage).toBe("");
  });

  it("uses the URI as label when labelDe is null on top-level and descendants", () => {
    const topNoLabel = "http://data.europa.eu/bna/c_top_no_label";
    const subNoLabel = "http://data.europa.eu/bna/c_sub_no_label";
    render(
      <GroupedMultiCheckBox
        name="hvd_categories"
        hvdMap={{
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
        legend="HVD Kategorien"
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
