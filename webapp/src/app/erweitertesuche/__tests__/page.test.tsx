import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import {
  fetchAvailableHvdCategoryUris,
  fetchCategoriesSorted,
  fetchHvdCategoryMap,
  fetchLicenseActiveSorted,
  fetchOrganizationSorted,
  fetchResourceFormatsSorted,
  fetchStateList,
} from "@/app/_lib/getData";
import { HvdCategoryMap } from "@/types/types";

import ErweiterteSuche, { metadata } from "../page";

vi.mock("ioredis");
vi.mock("@/app/_lib/getData");

vi.mock("@/app/erweitertesuche/ExtendedSearchFields", () => ({
  ExtendedSearchFields: (props: { hvdMap: HvdCategoryMap }) => (
    <div
      data-testid="extended-search-fields"
      data-hvd-uris={Object.keys(props.hvdMap).join(",")}
    />
  ),
}));

const fullHvdMap: HvdCategoryMap = {
  "http://example.org/hvd/parent": {
    uri: "http://example.org/hvd/parent",
    labelDe: "Parent",
    labelEn: "Parent",
    parentUri: null,
    deprecated: false,
  },
  "http://example.org/hvd/child": {
    uri: "http://example.org/hvd/child",
    labelDe: "Child",
    labelEn: "Child",
    parentUri: "http://example.org/hvd/parent",
    deprecated: false,
  },
  "http://example.org/hvd/unused": {
    uri: "http://example.org/hvd/unused",
    labelDe: "Unused",
    labelEn: "Unused",
    parentUri: null,
    deprecated: false,
  },
};

const pageProps = {
  params: Promise.resolve({ slug: "" }),
  searchParams: Promise.resolve({}),
};

describe("Extended Search Page", () => {
  beforeEach(() => {
    vi.mocked(fetchStateList).mockResolvedValue([]);
    vi.mocked(fetchCategoriesSorted).mockResolvedValue([]);
    vi.mocked(fetchLicenseActiveSorted).mockResolvedValue([]);
    vi.mocked(fetchOrganizationSorted).mockResolvedValue([]);
    vi.mocked(fetchResourceFormatsSorted).mockResolvedValue([]);
    vi.mocked(fetchHvdCategoryMap).mockResolvedValue(fullHvdMap);
  });

  it("should set correct metadata", () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toMatch(/^Erweiterte Suche -/);
    expect(metadata.openGraph?.title).toMatch(/^Erweiterte Suche -/);
  });

  it("passes only available HVD categories (plus ancestors) when the index service returns URIs", async () => {
    vi.mocked(fetchAvailableHvdCategoryUris).mockResolvedValue([
      "http://example.org/hvd/child",
    ]);

    const { getByTestId } = render(await ErweiterteSuche(pageProps));

    const uris = getByTestId("extended-search-fields")
      .getAttribute("data-hvd-uris")!
      .split(",");
    expect(uris).toContain("http://example.org/hvd/child");
    expect(uris).toContain("http://example.org/hvd/parent");
    expect(uris).not.toContain("http://example.org/hvd/unused");
  });

  it("falls back to the full vocabulary when the index service is unreachable", async () => {
    vi.mocked(fetchAvailableHvdCategoryUris).mockResolvedValue([]);

    const { getByTestId } = render(await ErweiterteSuche(pageProps));

    const uris = getByTestId("extended-search-fields")
      .getAttribute("data-hvd-uris")!
      .split(",");
    expect(uris).toEqual(Object.keys(fullHvdMap));
  });
});
