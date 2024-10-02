// @vitest-environment node

import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "../scroll/route";
import { headers } from "next/headers";

vi.mock("next/headers");

describe("api/scroll", () => {
  beforeAll(() => {
    vi.stubEnv("BE_GD_SEARCH_SCROLL_URL", "www.scroll.me");
  });

  beforeEach(() => {
    vi.mocked(headers).mockReturnValue(new Headers());
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => ({
        hits: [{ content: "<div>hey</div>" }],
      }),
    });
  });

  it("should not call fetch if no scrollId is provided", async () => {
    const url = new URL("https://test.de");
    const request = new Request(url);
    const response = await GET(request);

    expect(fetch).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("[]");
  });

  it("should fetch suggestions and strip all html", async () => {
    const url = new URL("https://test.de?scrollId=12345");
    const request = new Request(url);
    const response = await GET(request);

    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toBe('{"hits":[{"content":"hey"}]}');
    expect(fetch).toHaveBeenCalledWith(
      "www.scroll.me/12345",
      expect.anything(),
    );
  });
});
