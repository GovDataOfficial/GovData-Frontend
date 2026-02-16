// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  sendAuthorizedRequestWithBasicAuth,
  sendAuthorizedRequestWithBearer,
} from "@/app/api/_lib/sendAuthorizedRequest";

vi.mock("ioredis");

describe("sendAuthorizedRequest", () => {
  const username = "test";

  beforeEach(() => {
    vi.resetAllMocks();
    globalThis.fetch = vi.fn();
  });

  it("should return the resolved error if fetch fails", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: vi.fn().mockResolvedValue("Some error occurred"),
    } as any);

    const authorizedRequest = sendAuthorizedRequestWithBasicAuth(
      username,
      "https://create-metadata",
      "POST",
      {},
    );
    const response = await authorizedRequest;
    expect(response?.status).toBe(400);
  });

  it("should include X-Error-Timestamp header when request fails", async () => {
    const fixedDate = new Date("2026-01-19T10:30:45.123Z");
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: vi.fn().mockResolvedValue("Server error"),
    } as any);

    const authorizedRequest = sendAuthorizedRequestWithBasicAuth(
      username,
      "https://create-metadata",
      "POST",
      {},
    );
    const response = await authorizedRequest;

    expect(response?.status).toBe(500);
    const timestamp = response?.headers.get("X-Error-Timestamp");
    expect(timestamp).toBe("2026-01-19T10:30:45.123Z");

    vi.useRealTimers();
  });

  it("should include X-Error-Timestamp header when fetch throws an error", async () => {
    const fixedDate = new Date("2026-01-19T14:22:10.456Z");
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);

    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    const authorizedRequest = sendAuthorizedRequestWithBasicAuth(
      username,
      "https://create-metadata",
      "POST",
      {},
    );
    const response = await authorizedRequest;

    expect(response?.status).toBe(500);
    const timestamp = response?.headers.get("X-Error-Timestamp");
    expect(timestamp).toBe("2026-01-19T14:22:10.456Z");

    vi.useRealTimers();
  });

  it("should correctly call fetch", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
    } as any);

    const bodyContent = {
      testValue: "a value",
    };

    const authorizedRequest = sendAuthorizedRequestWithBasicAuth(
      username,
      "https://create-metadata",
      "POST",
      bodyContent,
    );
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

describe("sendAuthorizedRequestWithBearer", () => {
  // Updated mock to match the SessionInformation interface from _session.ts
  const mockValidSession = {
    username: "test",
    id_token: "mock-id-token",
    access_token: "mock-jwt-token-123",
    refresh_token: "mock-refresh-token",
    iat: Math.floor(Date.now() / 1000),
    roles: ["showcases"],
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    globalThis.fetch = vi.fn();
  });

  it("should return 500 if fetch fails", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    const authorizedRequest = sendAuthorizedRequestWithBearer(
      mockValidSession,
      "https://api-endpoint",
      "GET",
      undefined,
    );
    const response = await authorizedRequest;
    expect(response?.status).toBe(500);
  });

  it("should include X-Error-Timestamp header when response is not ok", async () => {
    const fixedDate = new Date("2026-01-19T08:15:30.789Z");
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      text: vi.fn().mockResolvedValue("Forbidden"),
    } as any);

    const authorizedRequest = sendAuthorizedRequestWithBearer(
      mockValidSession,
      "https://api-endpoint",
      "GET",
      undefined,
    );
    const response = await authorizedRequest;

    expect(response?.status).toBe(403);
    const timestamp = response?.headers.get("X-Error-Timestamp");
    expect(timestamp).toBe("2026-01-19T08:15:30.789Z");

    vi.useRealTimers();
  });

  it("should include X-Error-Timestamp header when fetch throws an exception", async () => {
    const fixedDate = new Date("2026-01-19T16:45:20.111Z");
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);

    vi.mocked(fetch).mockRejectedValueOnce(new Error("Connection timeout"));

    const authorizedRequest = sendAuthorizedRequestWithBearer(
      mockValidSession,
      "https://api-endpoint",
      "POST",
      { data: "test" },
    );
    const response = await authorizedRequest;

    expect(response?.status).toBe(500);
    const timestamp = response?.headers.get("X-Error-Timestamp");
    expect(timestamp).toBe("2026-01-19T16:45:20.111Z");

    vi.useRealTimers();
  });

  it("should correctly set Authorization header with Bearer token", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
    } as any);

    const authorizedRequest = sendAuthorizedRequestWithBearer(
      mockValidSession,
      "https://api-endpoint",
      "GET",
      undefined,
    );
    await authorizedRequest;

    const [_url, options] = vi.mocked(globalThis.fetch).mock.calls[0];
    const headers = options?.headers as Record<string, string>;

    expect(headers["Authorization"]).toBe(
      `Bearer ${mockValidSession.access_token}`,
    );
  });

  it("should correctly handle POST request with body", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 201,
      statusText: "Created",
    } as any);

    const bodyContent = {
      key: "value",
      nested: { property: true },
    };

    const authorizedRequest = sendAuthorizedRequestWithBearer(
      mockValidSession,
      "https://api-endpoint",
      "POST",
      bodyContent,
    );
    const response = await authorizedRequest;

    const [url, options] = vi.mocked(globalThis.fetch).mock.calls[0];

    // Check URL formatting
    expect(url).toEqual(new URL("https://api-endpoint/"));

    // Check method
    expect(options?.method).toEqual("POST");

    // Check headers
    const headers = options?.headers as Record<string, string>;
    expect(headers["Authorization"]).toBe(
      `Bearer ${mockValidSession.access_token}`,
    );
    expect(headers["Content-Type"]).toEqual("application/json");

    // Check body
    const parsedBody = JSON.parse(options?.body as string);
    expect(parsedBody).toEqual(bodyContent);

    // Check response
    expect(response?.status).toBe(201);
  });

  it("should correctly handle query parameters in URL", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
    } as any);

    const authorizedRequest = sendAuthorizedRequestWithBearer(
      mockValidSession,
      "https://api-endpoint?param1=value1&param2=value2",
      "GET",
      undefined,
    );
    await authorizedRequest;

    const [url, _options] = vi.mocked(globalThis.fetch).mock.calls[0];

    expect(url.toString()).toBe(
      "https://api-endpoint/?param1=value1&param2=value2",
    );
  });

  it("should return an error response if response is not ok", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      text: vi.fn().mockResolvedValue("Forbidden"),
    } as any);

    const authorizedRequest = sendAuthorizedRequestWithBearer(
      mockValidSession,
      "https://api-endpoint",
      "GET",
      undefined,
    );

    const response = await authorizedRequest;

    expect(response?.status).toBe(403);
  });

  it("should handle response with status 204 properly", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 204,
      statusText: "No Content",
    } as any);

    const authorizedRequest = sendAuthorizedRequestWithBearer(
      mockValidSession,
      "https://api-endpoint",
      "DELETE",
      undefined,
    );

    const response = await authorizedRequest;

    expect(response?.status).toBe(204);
  });
});
