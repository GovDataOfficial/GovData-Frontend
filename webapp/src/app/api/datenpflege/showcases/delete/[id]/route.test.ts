// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { checkFeatureFlagForDataManagement } from "@/app/api/_lib/checkFeatureFlags";
import { getSessionOrThrow } from "@/app/api/_lib/getSessionOrThrow";
import { sendAuthorizedRequestWithBearer } from "@/app/api/_lib/sendAuthorizedRequest";
import { SessionInformation } from "@/app/api/auth/_session";
import { DELETE } from "@/app/api/datenpflege/showcases/delete/[id]/route";
import { POST } from "@/app/api/datenpflege/showcases/edit/[id]/route";

vi.mock("@/app/api/_lib/sendAuthorizedRequest");
vi.mock("@/app/api/_lib/getSessionOrThrow");
vi.mock("@/app/api/_lib/checkFeatureFlags");

describe("Showcase Delete Route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("be_gd_db_url", "https://test.com");
    vi.mocked(sendAuthorizedRequestWithBearer).mockResolvedValueOnce({
      status: 200,
    } as any);
    vi.mocked(checkFeatureFlagForDataManagement).mockReturnValue(true);
  });

  it("should return 401 if no session is available", async () => {
    vi.mocked(getSessionOrThrow).mockRejectedValueOnce(new Error("No session"));
    const deleteRequest = DELETE({} as Request, {
      params: Promise.resolve({ id: "test" }),
    });
    const response = await deleteRequest;
    expect(response?.status).toBe(401);
  });

  it("should call sendAuthorizedRequest with correct data", async () => {
    const session = {};
    vi.mocked(getSessionOrThrow).mockResolvedValueOnce(
      session as SessionInformation,
    );
    const deleteRequest = DELETE({} as Request, {
      params: Promise.resolve({ id: "test" }),
    });
    const response = await deleteRequest;

    expect(sendAuthorizedRequestWithBearer).toHaveBeenCalledWith(
      session,
      "https://test.com/showcase/test",
      "DELETE",
    );
    expect(response).not.toBeUndefined();
  });

  it("should return 501 if feature is not enabled", async () => {
    vi.mocked(checkFeatureFlagForDataManagement).mockReturnValue(false);
    const response = await DELETE({} as Request, {
      params: Promise.resolve({ id: "test" }),
    });
    expect(response?.status).toBe(501);
  });
});
