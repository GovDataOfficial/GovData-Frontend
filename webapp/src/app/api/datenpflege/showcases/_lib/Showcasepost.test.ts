// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { sendAuthorizedRequestWithBearer } from "@/app/api/_lib/sendAuthorizedRequest";
import { SessionInformation } from "@/app/api/auth/_session";
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

    const session = {} as SessionInformation;
    const postRequest = postShowcase(
      session,
      request,
      "https://test.com/create-showcase",
      "POST",
    );
    const response = await postRequest;

    const [firstParam, secondParam, thirdParam, fourthParam] = vi.mocked(
      sendAuthorizedRequestWithBearer,
    ).mock.calls[0];

    expect(firstParam).toEqual(session);
    expect(secondParam).toEqual("https://test.com/create-showcase");
    expect(thirdParam).toEqual("POST");
    expect(fourthParam).toBeDefined();
    expect(response).not.toBeUndefined();
  });
});
