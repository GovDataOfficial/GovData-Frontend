import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SearchPage from "../page";
import { getSearchResults } from "@/app/_lib/getData";

vi.mock("@/app/_lib/getData", () => ({
  getSearchResults: vi.fn(),
}));

const emptySearchResults = {
  hitsTotal: 0,
  scrollId: "213",
  hits: [],
  pageSize: 10,
  filterMap: {},
  cleanedActiveFilters: {},
  suggestions: [],
  moreNextHitsAvailable: false,
};

// TODO activate after h1 is reworked
describe.skip("SearchPage", () => {
  it("should render correct title with when query is available", async () => {
    vi.mocked(getSearchResults).mockResolvedValue(emptySearchResults);
    const Component = await SearchPage({
      searchParams: { q: "test" },
      params: { slug: "" },
    });
    render(Component);
    screen.getByRole("heading", {
      name: "Ihre Suche nach „test“ ergab keine Treffer",
      level: 1,
    });
  });

  // TODO activate after h1 is reworked
  it.skip("should render correct title with when no query is available", async () => {
    vi.mocked(getSearchResults).mockResolvedValue(emptySearchResults);
    const Component = await SearchPage({
      searchParams: { q: "" },
      params: { slug: "" },
    });
    render(Component);
    screen.getByRole("heading", {
      name: "Ihre Suche ergab keine Treffer",
      level: 1,
    });
  });
});
