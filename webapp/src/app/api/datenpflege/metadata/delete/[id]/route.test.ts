// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { checkFeatureFlagForEnvVarDataManagement } from "@/app/api/_lib/checkEnvVarFeatureFlags";
import { getSessionOrThrow } from "@/app/api/_lib/getSessionOrThrow";
import { sendAuthorizedRequestWithBasicAuth } from "@/app/api/_lib/sendAuthorizedRequest";
import { SessionInformation } from "@/app/api/auth/_session";
import { DELETE } from "@/app/api/datenpflege/metadata/delete/[id]/route";

vi.mock("@/app/api/_lib/sendAuthorizedRequest");
vi.mock("@/app/api/_lib/getSessionOrThrow");
vi.mock("@/app/api/_lib/checkEnvVarFeatureFlags");

describe("Metadata Delete Route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("be_gd_data_url", "https://test.com");
    vi.mocked(sendAuthorizedRequestWithBasicAuth).mockResolvedValueOnce({
      status: 200,
    } as any);
    vi.mocked(checkFeatureFlagForEnvVarDataManagement).mockReturnValue(true);
  });

  it("should return 401 if no session is available", async () => {
    vi.mocked(getSessionOrThrow).mockRejectedValueOnce(new Error("No session"));
    const deleteRequest = DELETE({} as Request, {
      params: Promise.resolve({ id: "test" }),
    });
    const response = await deleteRequest;
    expect(response?.status).toBe(401);
  });

  it("should call sendAuthorizedRequestWithBasicAuth with correct data", async () => {
    const username = "test";
    vi.mocked(getSessionOrThrow).mockResolvedValueOnce({
      username,
    } as SessionInformation);
    const deleteRequest = DELETE({} as Request, {
      params: Promise.resolve({ id: "test" }),
    });
    const response = await deleteRequest;

    expect(sendAuthorizedRequestWithBasicAuth).toHaveBeenCalledWith(
      username,
      "https://test.com/metadata/test",
      "DELETE",
    );
    expect(response).not.toBeUndefined();
  });

  it("should return 501 if feature is not enabled", async () => {
    vi.mocked(checkFeatureFlagForEnvVarDataManagement).mockReturnValue(false);
    const deleteRequest = DELETE({} as Request, {
      params: Promise.resolve({ id: "test" }),
    });
    const response = await deleteRequest;
    expect(response?.status).toBe(501);
  });
});
