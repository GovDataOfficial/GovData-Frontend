import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  notFound,
  ReadonlyURLSearchParams,
  useSearchParams,
} from "next/navigation";

import { fetchMetadataQuality } from "@/app/_lib/getData";
import { MetadataQualityTestProps } from "@/app/metadatenqualitaet/__tests__/test.props";
import Page from "@/app/metadatenqualitaet/qualitaetsmerkmale/page";

vi.mock("@/app/_lib/getData", () => ({
  fetchMetadataQuality: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
  notFound: vi.fn(),
}));

describe("MetaDatenQualität - Qualitätsmerkmale - Page", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    vi.stubEnv("metadata_quality_dashboard_active", "1");
    vi.mocked(fetchMetadataQuality).mockResolvedValue(MetadataQualityTestProps);
    const searchParams = new URLSearchParams() as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(searchParams);
  });

  it("should render correct components", async () => {
    const Component = await Page({
      searchParams: {},
      params: { slug: "" },
    });
    render(Component);

    screen.getByRole("heading", { name: /qualitätsmerkmale/i, level: 2 });
    screen.getAllByRole("heading", { name: /filtermöglichkeiten/i, level: 2 });
    screen.getByRole("heading", {
      name: /übersicht auffindbarkeit/i,
      level: 2,
    });
    screen.getByRole("heading", {
      name: /übersicht weiterverwendbarkeit/i,
      level: 2,
    });
  });

  it("should call notFound if not active", async () => {
    vi.stubEnv("metadata_quality_dashboard_active", "");

    await Page({
      searchParams: {},
      params: { slug: "" },
    });
    expect(vi.mocked(notFound)).toHaveBeenCalled();
  });
});
