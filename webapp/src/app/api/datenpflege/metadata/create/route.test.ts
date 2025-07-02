// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSessionNameOrThrow } from "@/app/api/_lib/getSessionNameOrThrow";
import { postMetadata } from "@/app/api/datenpflege/metadata/_lib/postMetadata";

import { POST } from "./route";

vi.mock("@/app/api/datenpflege/metadata/_lib/postMetadata");
vi.mock("@/app/api/_lib/getSessionNameOrThrow");

describe("Metadata Create Route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("be_gd_data_url", "https://test.com");
    vi.mocked(postMetadata).mockResolvedValueOnce({ status: 200 } as any);
  });

  it("should return 401 if no session is available", async () => {
    vi.mocked(getSessionNameOrThrow).mockRejectedValueOnce(
      new Error("No session"),
    );
    const request = new Request("https://example.com", {});
    const response = await POST(request);
    expect(response?.status).toBe(401);
  });

  it("should call postMetadata with correct endpoint", async () => {
    const username = "test";
    vi.mocked(getSessionNameOrThrow).mockResolvedValueOnce(username);
    const request = new Request("https://example.com", {});
    const response = await POST(request);

    expect(postMetadata).toHaveBeenCalledWith(
      username,
      request,
      "https://test.com/metadata",
      "POST",
    );

    expect(response).not.toBeUndefined();
  });
});
