import { beforeAll, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  fetchMetadataForOrganizations,
  fetchOrganizationsForUser,
} from "@/app/_lib/getData";
import { getSessionOrRedirect } from "@/app/api/auth/_session";
import Page, { metadata } from "@/app/datenpflege/metadaten/page";
import {
  MetadataSearchResultHit,
  OrganizationSorted,
  SearchResults,
} from "@/types/types";

vi.mock("ioredis");
vi.mock("@/app/api/auth/_session");

vi.mock("@/app/_lib/getData", () => ({
  fetchOrganizationsForUser: vi.fn(),
  fetchMetadataForOrganizations: vi.fn(),
}));

const searchResults = {
  hits: [
    {
      id: "1",
      title: "Test Title 1",
      created: "2023-01-01",
      metadataModified: "2023-02-01",
    },
    {
      id: "2",
      title: "Test Title 2",
      created: "2022-03-01",
      metadataModified: "2022-04-01",
    },
  ],
} as unknown as SearchResults<MetadataSearchResultHit>;

const organizations = [
  {
    id: "org1",
    displayName: "Org 1",
    contributorIds: ["contrib1", "contrib2"],
  },
  {
    id: "org2",
    displayName: "Org 2",
    contributorIds: ["contrib3", "contrib4"],
  },
] as OrganizationSorted;

const pageParams = {
  params: { slug: "" },
  searchParams: {},
};

describe("Landing Page", () => {
  const mockTokenSet = {
    id_token: "123 ",
    name: "TestNutzer1",
    claims: () => ({ name: "TestNutzer1" }),
  } as any;

  beforeAll(() => {
    vi.mocked(getSessionOrRedirect).mockResolvedValue(mockTokenSet);
  });

  test("should render a link to create Metadata", async () => {
    vi.mocked(fetchOrganizationsForUser).mockResolvedValue(organizations);
    render(await Page(pageParams));

    screen.getByRole("link", { name: "Metadatensatz erstellen" });
  });

  test("should render a text if user has no organizations", async () => {
    vi.mocked(fetchOrganizationsForUser).mockResolvedValue(undefined);
    render(await Page(pageParams));

    screen.getByText(/warum werden mir keine informationen angezeigt?/i);
  });

  test("should render a text if user has no contributor id", async () => {
    vi.mocked(fetchOrganizationsForUser).mockResolvedValue([
      { id: "org1", displayName: "Org 1", contributorIds: [] },
    ] as unknown as OrganizationSorted);
    render(await Page(pageParams));

    screen.getByText(/warum werden mir keine informationen angezeigt?/i);
  });

  test("should have correct meta info", () => {
    expect(metadata.title).toBe("Datenpflege - GovData");
  });

  test("should show table", async () => {
    vi.mocked(fetchOrganizationsForUser).mockResolvedValue(organizations);
    vi.mocked(fetchMetadataForOrganizations).mockResolvedValue(searchResults);
    render(await Page(pageParams));
    const tableElement = screen.queryByRole("table");
    expect(tableElement).toBeInTheDocument();
  });

  test("should not show table if no data is available", async () => {
    vi.mocked(fetchOrganizationsForUser).mockResolvedValue(organizations);
    vi.mocked(fetchMetadataForOrganizations).mockResolvedValue(undefined);
    render(await Page(pageParams));
    const tableElement = screen.queryByRole("table");
    expect(tableElement).not.toBeInTheDocument();
  });

  test("should not render a deletion messages", async () => {
    vi.mocked(fetchOrganizationsForUser).mockResolvedValue(organizations);
    vi.mocked(fetchMetadataForOrganizations).mockResolvedValue(searchResults);

    render(await Page(pageParams));
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  test("should render a deletion success message", async () => {
    vi.mocked(fetchOrganizationsForUser).mockResolvedValue(organizations);
    vi.mocked(fetchMetadataForOrganizations).mockResolvedValue(searchResults);
    const deleteSuccessParams = {
      ...pageParams,
      searchParams: { deleteResult: "success", title: "aTitle" },
    };
    render(await Page(deleteSuccessParams));

    screen.getByRole("status");
    screen.getByText(/metadatensatz aTitle wurde erfolgreich gelöscht/i);
  });

  test("should render a deletion error message", async () => {
    vi.mocked(fetchOrganizationsForUser).mockResolvedValue(organizations);
    vi.mocked(fetchMetadataForOrganizations).mockResolvedValue(searchResults);
    const deleteSuccessParams = {
      ...pageParams,
      searchParams: { deleteResult: "error", title: "aTitle" },
    };
    render(await Page(deleteSuccessParams));

    screen.getByRole("alert");
    screen.getByText(/metadatensatz aTitle konnte nicht gelöscht werden/i);
  });
});
