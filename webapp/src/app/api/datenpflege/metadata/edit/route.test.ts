// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { checkFeatureFlagForEnvVarDataManagement } from "@/app/api/_lib/checkEnvVarFeatureFlags";
import { createErrorResponseWithTimestamp } from "@/app/api/_lib/errorResponseWithTimestamp";
import { postMetadata } from "@/app/api/datenpflege/metadata/_lib/postMetadata";

import { POST } from "./route";

vi.mock("@/app/api/datenpflege/metadata/_lib/postMetadata");
vi.mock("@/app/api/_lib/getSessionOrThrow");
vi.mock("@/app/api/_lib/checkEnvVarFeatureFlags");
vi.mock("@/app/api/_lib/errorResponseWithTimestamp");

describe("Metadata Edit Route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("be_gd_data_url", "https://test.com");
    vi.mocked(postMetadata).mockResolvedValueOnce({ status: 200 } as any);
    vi.mocked(checkFeatureFlagForEnvVarDataManagement).mockReturnValue(true);
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

  it("should return 501 if feature is not enabled", async () => {
    vi.mocked(checkFeatureFlagForEnvVarDataManagement).mockReturnValue(false);
    const request = new Request("https://example.com", {});
    const response = await POST(request);
    expect(response?.status).toBe(501);
  });
});
