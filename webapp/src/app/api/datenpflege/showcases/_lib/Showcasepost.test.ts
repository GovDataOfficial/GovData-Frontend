// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { sendAuthorizedRequestWithBearer } from "@/app/api/_lib/sendAuthorizedRequest";
import { postShowcase } from "@/app/api/datenpflege/showcases/_lib/postShowcase";

vi.mock("@/app/api/_lib/sendAuthorizedRequest");

describe("postShowcase", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(sendAuthorizedRequestWithBearer).mockResolvedValueOnce({
      status: 200,
    } as any);
  });

  it("should call sendAuthorizedRequest with correct data", async () => {
    const request = new Request("https://example.com", {
      method: "POST",
      body: new FormData(),
    });
    const postRequest = postShowcase(
      request,
      "https://test.com/create-showcase",
      "POST",
    );
    const response = await postRequest;

    const [firstParam, secondParam, thirdParam] = vi.mocked(
      sendAuthorizedRequestWithBearer,
    ).mock.calls[0];

    expect(firstParam).toEqual("https://test.com/create-showcase");
    expect(secondParam).toEqual("POST");
    expect(thirdParam).toBeDefined();
    expect(response).not.toBeUndefined();
  });
});
