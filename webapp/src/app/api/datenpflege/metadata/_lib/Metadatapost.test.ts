// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { sendAuthorizedRequestWithBasicAuth } from "@/app/api/_lib/sendAuthorizedRequest";

import { postMetadata } from "./postMetadata";

vi.mock("@/app/api/_lib/sendAuthorizedRequest");

describe("postMetadata", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(sendAuthorizedRequestWithBasicAuth).mockResolvedValueOnce({
      status: 200,
    } as any);
  });

  it("should call sendAuthorizedRequestWithBasicAuth with correct data", async () => {
    const request = new Request("https://example.com", {
      method: "POST",
      body: new FormData(),
    });
    const postRequest = postMetadata(
      request,
      "https://test.com/create-metadata",
      "POST",
    );
    const response = await postRequest;

    const [firstParam, secondParam, thirdParam] = vi.mocked(
      sendAuthorizedRequestWithBasicAuth,
    ).mock.calls[0];

    expect(firstParam).toEqual("https://test.com/create-metadata");
    expect(secondParam).toEqual("POST");
    expect(thirdParam).toBeDefined();
    expect(response).not.toBeUndefined();
  });
});
