// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { checkFeatureFlagForEnvVarDataManagement } from "@/app/api/_lib/checkEnvVarFeatureFlags";
import { postShowcase } from "@/app/api/datenpflege/showcases/_lib/postShowcase";

import { POST } from "./route";

vi.mock("@/app/api/datenpflege/showcases/_lib/postShowcase");
vi.mock("@/app/api/_lib/getSessionOrThrow");
vi.mock("@/app/api/_lib/checkEnvVarFeatureFlags");
vi.mock("@/app/api/_lib/errorResponseWithTimestamp");

describe("Showcase Create Route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("be_gd_db_url", "https://test.com");
    vi.mocked(postShowcase).mockResolvedValueOnce({ status: 200 } as any);
    vi.mocked(checkFeatureFlagForEnvVarDataManagement).mockReturnValue(true);
  });

  it("should call postShowcase with correct endpoint", async () => {
    const request = new Request("https://example.com", {});
    const response = await POST(request);

    expect(postShowcase).toHaveBeenCalledWith(
      request,
      "https://test.com/showcase",
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
