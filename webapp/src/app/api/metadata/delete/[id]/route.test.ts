// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { sendAuthorizedRequest } from "@/app/api/_lib/sendAuthorizedRequest";
import { DELETE } from "@/app/api/metadata/delete/[id]/route";

vi.mock("@/app/api/_lib/sendAuthorizedRequest");

describe("Metadata Delete Route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("be_gd_data_url", "https://test.com");
    vi.mocked(sendAuthorizedRequest).mockResolvedValueOnce({
      status: 200,
    } as any);
  });

  it("should call sendAuthorizedRequest with correct data", async () => {
    const deleteRequest = DELETE({} as Request, { params: { id: "test" } });
    const response = await deleteRequest;

    expect(sendAuthorizedRequest).toHaveBeenCalledWith(
      "https://test.com/metadata/test",
      "DELETE",
    );
    expect(response).not.toBeUndefined();
  });
});
