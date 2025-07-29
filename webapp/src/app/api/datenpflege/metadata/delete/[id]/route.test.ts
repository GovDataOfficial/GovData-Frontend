// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSessionNameOrThrow } from "@/app/api/_lib/getSessionNameOrThrow";
import { sendAuthorizedRequestWithBasicAuth } from "@/app/api/_lib/sendAuthorizedRequest";
import { DELETE } from "@/app/api/datenpflege/metadata/delete/[id]/route";

vi.mock("@/app/api/_lib/sendAuthorizedRequest");
vi.mock("@/app/api/_lib/getSessionNameOrThrow");

describe("Metadata Delete Route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("be_gd_data_url", "https://test.com");
    vi.mocked(sendAuthorizedRequestWithBasicAuth).mockResolvedValueOnce({
      status: 200,
    } as any);
  });

  it("should return 401 if no session is available", async () => {
    vi.mocked(getSessionNameOrThrow).mockRejectedValueOnce(
      new Error("No session"),
    );
    const deleteRequest = DELETE({} as Request, {
      params: Promise.resolve({ id: "test" }),
    });
    const response = await deleteRequest;
    expect(response?.status).toBe(401);
  });

  it("should call sendAuthorizedRequestWithBasicAuth with correct data", async () => {
    const username = "test";
    vi.mocked(getSessionNameOrThrow).mockResolvedValueOnce(username);
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
});
