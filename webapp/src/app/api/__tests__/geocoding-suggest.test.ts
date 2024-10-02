// @vitest-environment node

import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "../geocoding-suggest/route";
import { headers } from "next/headers";

vi.mock("next/headers");

describe("api/geocoding-suggest", () => {
  const envSearchmapSessionId = "BE_GD_DATA_SEARCHMAP_SESSION_ID";
  const envSearchmapTitleUrl = "BE_GD_DATA_SEARCHMAP_TILE_URL";
  const envGeoSearchUrl = "BE_GD_DATA_SEARCHMAP_GEOSEARCH_URL";
  const envOSMSearchUrl = "BE_GD_DATA_SEARCHMAP_OSMSEARCH_URL";
  const envUseOSM = "BE_GD_DATA_USE_OSM";

  beforeAll(() => {
    vi.stubEnv(envSearchmapSessionId, "test/searchmap");
    vi.stubEnv(envSearchmapTitleUrl, "test/wms_basemapde");
    vi.stubEnv(envGeoSearchUrl, "test/geosearch.json?count=5&query=");
    vi.stubEnv(envOSMSearchUrl, "https://openstreetmap.org/search?q=");
  });

  beforeEach(() => {
    vi.mocked(headers).mockReturnValue(new Headers());
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => "mock",
    });
  });

  it("should return empty array response on empty q params", async () => {
    const url = new URL("https://test.de");
    const request = new Request(url);
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("[]");
  });

  it("should fetch geocodingsuggest", async () => {
    vi.stubEnv(envUseOSM, "false");
    const fetchSpy = vi.mocked(global.fetch);

    const url = new URL("https://test.de?q=123&sessionId=3");
    const request = new Request(url);
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toBe("mock");
    expect(fetchSpy).toHaveBeenCalledWith(
      "test/geosearch.json?count=5&query=123",
      undefined,
    );
  });

  it("should fetch the open street map suggest", async () => {
    vi.stubEnv(envUseOSM, "true");
    const fetchSpy = vi.mocked(global.fetch);

    const url = new URL("https://test.de?q=mysuggest");
    const request = new Request(url);
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toBe("mock");
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://openstreetmap.org/search?q=mysuggest",
      undefined,
    );
  });
});
