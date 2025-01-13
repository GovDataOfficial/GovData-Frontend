// @vitest-environment node

import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchSearchScrollResults } from "@/app/_lib/getData";

import { GET } from "../scroll/route";

vi.mock("@/app/_lib/getData");

describe("api/scroll", () => {
  beforeAll(() => {
    vi.stubEnv("be_index_app2_url", "www.scroll.me");
  });

  beforeEach(() => {
    vi.mocked(fetchSearchScrollResults).mockResolvedValue({
      hits: [{ content: "<div>hey</div>" }],
    } as any);
  });

  it("should not call fetch if no scrollId is provided", async () => {
    const url = new URL("https://test.de");
    const request = new Request(url);
    const response = await GET(request);

    expect(fetchSearchScrollResults).not.toHaveBeenCalled();
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
    expect(fetchSearchScrollResults).toHaveBeenCalledWith("12345");
  });
});
