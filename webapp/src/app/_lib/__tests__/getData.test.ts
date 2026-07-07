// @vitest-environment node

import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { headers } from "next/headers";

import {
  fetchData,
  fetchMetadataForOrganizations,
  getSearchResults,
} from "@/app/_lib/getData";
import { DefaultSortOption } from "@/types/types";

vi.mock("next/headers");

describe("getData", () => {
  beforeEach(() => {
    vi.mocked(headers).mockResolvedValue(new Headers());
    vi.stubEnv("be_index_app2_url", "http://mtest.de");
    global.fetch = vi.fn().mockResolvedValue({
      json: () => vi.fn(),
      text: vi.fn().mockResolvedValue(""),
      status: 200,
      ok: true,
      headers: new Headers([["Content-Type", "application/json"]]),
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
      "http://mtest.de/search/search?queryString=ku&activeFilters=groups%3Aeduc%7Cgroups%3Atech%7Ctags%3Abauleitplan&sortType=relevance&ascending=false",
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

  it("fetchMetadataForOrganizations should create correct url", async () => {
    const mockOrg1 = {
      id: "1",
      name: "test",
      title: "test",
      displayName: "test",
      contributorIds: ["1"],
    };

    await fetchMetadataForOrganizations([mockOrg1]);
    expect(vi.mocked(global.fetch)).toHaveBeenCalledWith(
      "http://mtest.de/search/search?activeFilters=onlyEditorMetadata%3AhidePrivateDataset&sortType=lastmodification&ascending=false&numResults=3000&editorOrganizationIdList=1",
      expect.anything(),
    );
  });
});
