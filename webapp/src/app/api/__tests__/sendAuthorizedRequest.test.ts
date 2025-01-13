// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { sendAuthorizedRequest } from "@/app/api/_lib/sendAuthorizedRequest";
import { getUserInformation } from "@/app/api/auth/_session";

vi.mock("ioredis");
vi.mock("@/app/api/auth/_session");

describe("sendAuthorizedRequest", () => {
  const mockValidUser = {
    username: "test",
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
    globalThis.fetch = vi.fn();
  });

  it("should return 401 if no session is available", async () => {
    vi.mocked(getUserInformation).mockResolvedValueOnce(null);

    const authorizedRequest = sendAuthorizedRequest(
      "https://create-metadata",
      "POST",
      {},
    );
    vi.advanceTimersByTime(1000);
    const response = await authorizedRequest;
    expect(response?.status).toBe(401);
  });

  it("should return 500 if fetch fails", async () => {
    vi.mocked(getUserInformation).mockResolvedValueOnce(mockValidUser);
    vi.mocked(fetch).mockResolvedValueOnce({ status: 500 } as any);

    const authorizedRequest = sendAuthorizedRequest(
      "https://create-metadata",
      "POST",
      {},
    );
    vi.advanceTimersByTime(1000);
    const response = await authorizedRequest;
    expect(response?.status).toBe(500);
  });

  it("should correctly call fetch", async () => {
    vi.mocked(getUserInformation).mockResolvedValueOnce(mockValidUser);
    vi.mocked(fetch).mockResolvedValueOnce({ status: 200 } as any);

    const bodyContent = {
      testValue: "a value",
    };

    const authorizedRequest = sendAuthorizedRequest(
      "https://create-metadata",
      "POST",
      bodyContent,
    );
    vi.advanceTimersByTime(1000);
    const response = await authorizedRequest;

    const [firstParam, secondParam] = vi.mocked(globalThis.fetch).mock.calls[0];
    expect(globalThis.fetch).toHaveBeenCalled();

    expect(firstParam).toEqual(new URL("https://create-metadata/"));
    expect(secondParam?.method).toEqual("POST");

    const headers = secondParam?.headers as Record<string, string>;
    expect(headers["Authorization"]).not.toBeUndefined();
    expect(headers["Content-Type"]).toEqual("application/json");
    expect(headers["User"]).toEqual("test");

    const parsedBody = JSON.parse(secondParam?.body as string);
    expect(parsedBody.testValue).toEqual(bodyContent.testValue);

    expect(response?.status).toBe(200);
  });
});
