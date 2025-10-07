// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { checkFeatureFlagForDataManagement } from "@/app/api/_lib/checkFeatureFlags";
import { getSessionOrThrow } from "@/app/api/_lib/getSessionOrThrow";
import { SessionInformation } from "@/app/api/auth/_session";
import { postShowcase } from "@/app/api/datenpflege/showcases/_lib/postShowcase";

import { POST } from "./route";

vi.mock("@/app/api/datenpflege/showcases/_lib/postShowcase");
vi.mock("@/app/api/_lib/getSessionOrThrow");
vi.mock("@/app/api/_lib/checkFeatureFlags");

describe("Showcase Create Route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("be_gd_db_url", "https://test.com");
    vi.mocked(postShowcase).mockResolvedValueOnce({ status: 200 } as any);
    vi.mocked(checkFeatureFlagForDataManagement).mockReturnValue(true);
  });

  it("should return 401 if no session is available", async () => {
    vi.mocked(getSessionOrThrow).mockRejectedValueOnce(new Error("No session"));
    const request = new Request("https://example.com", {});
    const response = await POST(request);
    expect(response?.status).toBe(401);
  });

  it("should call postShowcase with correct endpoint", async () => {
    const session = {};
    vi.mocked(getSessionOrThrow).mockResolvedValueOnce(
      session as SessionInformation,
    );
    const request = new Request("https://example.com", {});
    const response = await POST(request);

    expect(postShowcase).toHaveBeenCalledWith(
      session,
      request,
      "https://test.com/showcase",
      "POST",
    );

    expect(response).not.toBeUndefined();
  });

  it("should return 501 if feature is not enabled", async () => {
    vi.mocked(checkFeatureFlagForDataManagement).mockReturnValue(false);
    const request = new Request("https://example.com", {});
    const response = await POST(request);
    expect(response?.status).toBe(501);
  });
});
