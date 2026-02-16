// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { checkFeatureFlagForEnvVarDataManagement } from "@/app/api/_lib/checkEnvVarFeatureFlags";
import { sendAuthorizedRequestWithBearer } from "@/app/api/_lib/sendAuthorizedRequest";
import { DELETE } from "@/app/api/datenpflege/showcases/delete/[id]/route";

vi.mock("@/app/api/_lib/sendAuthorizedRequest");
vi.mock("@/app/api/_lib/getSessionOrThrow");
vi.mock("@/app/api/_lib/checkEnvVarFeatureFlags");
vi.mock("@/app/api/_lib/errorResponseWithTimestamp");

describe("Showcase Delete Route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("be_gd_db_url", "https://test.com");
    vi.mocked(sendAuthorizedRequestWithBearer).mockResolvedValueOnce({
      status: 200,
    } as any);
    vi.mocked(checkFeatureFlagForEnvVarDataManagement).mockReturnValue(true);
  });

  it("should call sendAuthorizedRequest with correct data", async () => {
    const deleteRequest = DELETE({} as Request, {
      params: Promise.resolve({ id: "test" }),
    });
    const response = await deleteRequest;

    expect(sendAuthorizedRequestWithBearer).toHaveBeenCalledWith(
      "https://test.com/showcase/test",
      "DELETE",
    );
    expect(response).not.toBeUndefined();
  });

  it("should return 501 if feature is not enabled", async () => {
    vi.mocked(checkFeatureFlagForEnvVarDataManagement).mockReturnValue(false);
    const response = await DELETE({} as Request, {
      params: Promise.resolve({ id: "test" }),
    });
    expect(response?.status).toBe(501);
  });
});
