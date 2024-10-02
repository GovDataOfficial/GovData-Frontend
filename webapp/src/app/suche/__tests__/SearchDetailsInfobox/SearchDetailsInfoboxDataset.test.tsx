import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SearchDetailsInfoboxDataSet } from "@/app/suche/_components/SearchDetailsInfobox/SearchDetailsInfoboxDataset";
import { metaDataTestProps } from "../props";

vi.mock("@/app/_lib/getDisplayName", () => ({
  getOrganizationDisplayName: vi.fn().mockResolvedValue("test"),
}));

vi.mock("@/app/_lib/getData", () => ({
  fetchDataSetShowCaseConnection: vi.fn().mockResolvedValue(undefined),
}));

describe("SearchDetailsInfoboxDataSet", () => {
  beforeAll(() => {
    vi.stubEnv("BE_GD_CKAN_DATASET_URL", "http://test/ckan");
  });

  it("should have correct heading", async () => {
    const Component = await SearchDetailsInfoboxDataSet({
      data: metaDataTestProps,
    });

    render(Component);

    screen.getByRole("heading", { name: "Details zum Datensatz", level: 2 });
  });

  it("should set hvd on infobox container", async () => {
    const data = Object.assign(metaDataTestProps, { hvd: true });

    const Component = await SearchDetailsInfoboxDataSet({
      data,
    });

    const { container } = render(Component);
    expect(container.querySelector(".searchdetails-infobox.hvd")).toBeDefined();
  });

  it("should correctly map tags", async () => {
    const data = Object.assign(metaDataTestProps, { hvd: true });

    const Component = await SearchDetailsInfoboxDataSet({
      data,
    });
    render(Component);

    expect(screen.getByText(/schlagwörter/i)).toBeDefined();
  });

  it("should create correct ckan url", async () => {
    const Component = await SearchDetailsInfoboxDataSet({
      data: metaDataTestProps,
    });

    render(Component);

    const downloadLink = screen.getByRole("link", {
      name: /download metadaten/i,
    });

    expect(downloadLink).toHaveAttribute("target", "_blank");
    expect(downloadLink).toHaveAttribute(
      "href",
      "http://test/ckan/metadata_max.rdf",
    );
  });
});
