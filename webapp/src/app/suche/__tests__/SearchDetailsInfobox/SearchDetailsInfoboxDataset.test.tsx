import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { SearchDetailsInfoboxDataSet } from "@/app/suche/_components/SearchDetailsInfobox/SearchDetailsInfoboxDataset";

import { metaDataTestProps } from "../props";

vi.mock("@/app/_lib/organization", () => ({
  getOrganizationDisplayName: vi.fn().mockResolvedValue("test"),
}));

vi.mock("@/app/_lib/getData", () => ({
  fetchDataSetShowCaseConnection: vi.fn().mockResolvedValue(undefined),
}));

describe("SearchDetailsInfoboxDataSet", () => {
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
});
