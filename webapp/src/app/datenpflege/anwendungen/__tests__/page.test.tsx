import { beforeAll, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { fetchShowcases } from "@/app/_lib/getData";
import {
  getSessionOrRedirect,
  getUserInformation,
} from "@/app/api/auth/_session";
import Page, { metadata } from "@/app/datenpflege/anwendungen/page";
import { SearchResults, ShowcasesSearchResultHit } from "@/types/types";

vi.mock("ioredis");
vi.mock("@/app/api/auth/_session");

vi.mock("@/app/_lib/getData", () => ({
  fetchShowcases: vi.fn(),
}));

const searchResults = {
  hits: [
    {
      id: "1",
      title: "Test Title 1",
      releaseDate: "2023-01-01",
      lastModified: "2023-02-01",
    },
    {
      id: "2",
      title: "Test Title 2",
      releaseDate: "2022-03-01",
      lastModified: "2022-04-01",
    },
  ],
} as unknown as SearchResults<ShowcasesSearchResultHit>;

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

  vi.mocked(getUserInformation).mockResolvedValue({
    username: "test",
    isShowcaseEditor: true,
  });

  test("should render a link to create showcase", async () => {
    render(await Page(pageParams));
    screen.getByRole("link", { name: "Anwendung erstellen" });
  });

  test("should have correct meta info", () => {
    expect(metadata.title).toBe("Anwendungen - GovData");
  });

  test("should show table", async () => {
    vi.mocked(fetchShowcases).mockResolvedValue(searchResults);
    render(await Page(pageParams));
    const tableElement = screen.queryByRole("table");
    expect(tableElement).toBeInTheDocument();
  });

  test("should not show table if no data is available", async () => {
    vi.mocked(fetchShowcases).mockResolvedValue(undefined);
    render(await Page(pageParams));
    const tableElement = screen.queryByRole("table");
    expect(tableElement).not.toBeInTheDocument();
  });

  test("should not render a deletion messages", async () => {
    vi.mocked(fetchShowcases).mockResolvedValue(searchResults);

    render(await Page(pageParams));
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  test("should render a deletion success message", async () => {
    vi.mocked(fetchShowcases).mockResolvedValue(searchResults);
    const deleteSuccessParams = {
      ...pageParams,
      searchParams: { deleteResult: "success", title: "aTitle" },
    };
    render(await Page(deleteSuccessParams));

    screen.getByRole("status");
    screen.getByText(/anwendung aTitle wurde erfolgreich gelöscht/i);
  });

  test("should render a deletion error message", async () => {
    vi.mocked(fetchShowcases).mockResolvedValue(searchResults);
    const deleteSuccessParams = {
      ...pageParams,
      searchParams: { deleteResult: "error", title: "aTitle" },
    };
    render(await Page(deleteSuccessParams));

    screen.getByRole("alert");
    screen.getByText(/anwendung aTitle konnte nicht gelöscht werden/i);
  });

  test("should show an information text if user is not a showcase editor", async () => {
    vi.mocked(getUserInformation).mockResolvedValue({
      username: "test",
      isShowcaseEditor: false,
    });

    render(await Page(pageParams));
    screen.getByText(/Sie verfügen nicht über die Berechtigung/i);
  });
});
