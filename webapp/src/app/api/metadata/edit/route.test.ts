// @vitest-environment node

import { POST } from "./route";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { postMetadata } from "@/app/api/metadata/_lib/postMetadata";

vi.mock("@/app/api/metadata/_lib/postMetadata");

describe("Metadata Edit Route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("be_gd_data_url", "https://test.com");
    vi.mocked(postMetadata).mockResolvedValueOnce({ status: 200 } as any);
  });

  it("should call postMetadata with correct endpoint", async () => {
    const request = new Request("https://example.com", {});
    const response = await POST(request);

    expect(postMetadata).toHaveBeenCalledWith(
      request,
      "https://test.com/metadata",
      "PUT",
    );

    expect(response).not.toBeUndefined();
  });
});
