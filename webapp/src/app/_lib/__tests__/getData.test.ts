// @vitest-environment node

import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { getSearchResults, fetchData } from "@/app/_lib/getData";
import { headers } from "next/headers";
import { DefaultSortOption } from "@/types/types";

vi.mock("next/headers");

describe("Get DefaultFormData", () => {
  beforeEach(() => {
    vi.mocked(headers).mockReturnValue(new Headers());
    vi.stubEnv("be_index_app2_url", "http://mtest.de");
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: () => vi.fn(),
      text: vi.fn().mockResolvedValue(""),
      status: 200,
    });
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  it("getSearchResults should correctly transform filters with q", async () => {
    const nextJsSearchParams = {
      q: "ku",
      groups: ["educ", "tech"],
      tags: "bauleitplan",
    };
    await getSearchResults(nextJsSearchParams);
    expect(vi.mocked(global.fetch)).toHaveBeenCalledWith(
      "http://mtest.de/search/search?queryString=ku&activeFilters=groups%3Aeduc%2Cgroups%3Atech%2Ctags%3Abauleitplan&sortType=relevance&ascending=false",
      expect.anything(),
    );
  });

  it("getSearchResults should correctly transform date", async () => {
    const nextJsSearchParams = { start: "2024-04-30", end: "2024-05-02" };
    await getSearchResults(nextJsSearchParams);
    expect(vi.mocked(global.fetch)).toHaveBeenCalledWith(
      "http://mtest.de/search/search?dateFrom=2024-04-30&dateUntil=2024-05-02&sortType=relevance&ascending=false",
      expect.anything(),
    );
  });

  it("getSearchResults should correctly transform sort params", async () => {
    const nextJsSearchParams = { sort: "lastmodification_asc" };
    await getSearchResults(nextJsSearchParams);
    expect(vi.mocked(global.fetch)).toHaveBeenCalledWith(
      "http://mtest.de/search/search?sortType=lastmodification&ascending=true",
      expect.anything(),
    );
  });

  it("getSearchResults should correctly transform sort params", async () => {
    const nextJsSearchParams = { sort: DefaultSortOption };
    await getSearchResults(nextJsSearchParams);
    expect(vi.mocked(global.fetch)).toHaveBeenCalledWith(
      "http://mtest.de/search/search?sortType=relevance&ascending=false",
      expect.anything(),
    );
  });

  it("should call fetchData with no-cache options", async () => {
    await fetchData("http://www.test.de", { other: "option" });
    expect(vi.mocked(global.fetch)).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ cache: "no-cache" }),
    );
  });
});
