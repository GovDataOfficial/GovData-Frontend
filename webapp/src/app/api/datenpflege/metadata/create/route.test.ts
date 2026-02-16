// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { checkFeatureFlagForEnvVarDataManagement } from "@/app/api/_lib/checkEnvVarFeatureFlags";
import { getSessionOrThrow } from "@/app/api/_lib/getSessionOrThrow";
import { SessionInformation } from "@/app/api/auth/_session";
import { postMetadata } from "@/app/api/datenpflege/metadata/_lib/postMetadata";

import { POST } from "./route";

vi.mock("@/app/api/datenpflege/metadata/_lib/postMetadata");
vi.mock("@/app/api/_lib/getSessionOrThrow");
vi.mock("@/app/api/_lib/checkEnvVarFeatureFlags");

describe("Metadata Create Route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("be_gd_data_url", "https://test.com");
    vi.stubEnv("be_gd_data_url", "https://test.com");
    vi.mocked(postMetadata).mockResolvedValueOnce({ status: 200 } as any);
    vi.mocked(checkFeatureFlagForEnvVarDataManagement).mockReturnValue(true);
  });

  it("should return 401 if no session is available", async () => {
    vi.mocked(getSessionOrThrow).mockRejectedValueOnce(new Error("No session"));
    const request = new Request("https://example.com", {});
    const response = await POST(request);
    expect(response?.status).toBe(401);
  });

  it("should call postMetadata with correct endpoint", async () => {
    const username = "test";
    vi.mocked(getSessionOrThrow).mockResolvedValueOnce({
      username,
    } as SessionInformation);
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

  it("should return 501 if feature is not enabled", async () => {
    vi.mocked(checkFeatureFlagForEnvVarDataManagement).mockReturnValue(false);
    const request = new Request("https://example.com", {});
    const response = await POST(request);
    expect(response?.status).toBe(501);
  });
});
