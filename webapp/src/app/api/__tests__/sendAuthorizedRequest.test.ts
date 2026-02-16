// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { createErrorResponseWithTimestamp } from "@/app/api/_lib/errorResponseWithTimestamp";
import { getSessionOrThrow } from "@/app/api/_lib/getSessionOrThrow";
import {
  sendAuthorizedRequestWithBasicAuth,
  sendAuthorizedRequestWithBearer,
} from "@/app/api/_lib/sendAuthorizedRequest";
import { SessionInformation } from "@/app/api/auth/_session";

vi.mock("ioredis");
vi.mock("@/app/api/_lib/errorResponseWithTimestamp");
vi.mock("@/app/api/_lib/getSessionOrThrow");

describe("sendAuthorizedRequest", () => {
  const mockSession = {
    username: "test",
  } as SessionInformation;

  beforeEach(() => {
    vi.resetAllMocks();
    globalThis.fetch = vi.fn();
    vi.mocked(getSessionOrThrow).mockResolvedValue(mockSession);
  });

  it("should return 401 if getSessionOrThrow fails", async () => {
    const mockErrorResponse = new Response(null, { status: 401 });
    vi.mocked(createErrorResponseWithTimestamp).mockReturnValueOnce(
      mockErrorResponse,
    );
    vi.mocked(getSessionOrThrow).mockRejectedValueOnce(new Error("No session"));

    const authorizedRequest = sendAuthorizedRequestWithBasicAuth(
      "https://create-metadata",
      "POST",
      {},
    );
    const response = await authorizedRequest;

    expect(response).toBe(mockErrorResponse);
    expect(createErrorResponseWithTimestamp).toHaveBeenCalledWith(null, 401);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should return the resolved error if fetch fails", async () => {
    const mockErrorResponse = new Response("Some error occurred", {
      status: 400,
    });
    vi.mocked(createErrorResponseWithTimestamp).mockReturnValueOnce(
      mockErrorResponse,
    );

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: vi.fn().mockResolvedValue("Some error occurred"),
    } as any);

    const authorizedRequest = sendAuthorizedRequestWithBasicAuth(
      "https://create-metadata",
      "POST",
      {},
    );
    const response = await authorizedRequest;
    expect(response).toBe(mockErrorResponse);
    expect(createErrorResponseWithTimestamp).toHaveBeenCalledWith(
      "Some error occurred",
      400,
    );
  });

  it("should call createErrorResponseWithTimestamp when request fails", async () => {
    const mockErrorResponse = new Response("Server error", { status: 500 });
    vi.mocked(createErrorResponseWithTimestamp).mockReturnValueOnce(
      mockErrorResponse,
    );

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: vi.fn().mockResolvedValue("Server error"),
    } as any);

    const authorizedRequest = sendAuthorizedRequestWithBasicAuth(
      "https://create-metadata",
      "POST",
      {},
    );
    const response = await authorizedRequest;

    expect(response).toBe(mockErrorResponse);
    expect(createErrorResponseWithTimestamp).toHaveBeenCalledWith(
      "Server error",
      500,
    );
  });

  it("should call createErrorResponseWithTimestamp when fetch throws an error", async () => {
    const mockErrorResponse = new Response(null, { status: 500 });
    vi.mocked(createErrorResponseWithTimestamp).mockReturnValueOnce(
      mockErrorResponse,
    );

    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    const authorizedRequest = sendAuthorizedRequestWithBasicAuth(
      "https://create-metadata",
      "POST",
      {},
    );
    const response = await authorizedRequest;

    expect(response).toBe(mockErrorResponse);
    expect(createErrorResponseWithTimestamp).toHaveBeenCalledWith();
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
  const mockValidSession = {
    access_token: "mock-jwt-token-123",
  } as SessionInformation;

  beforeEach(() => {
    vi.resetAllMocks();
    globalThis.fetch = vi.fn();
    vi.mocked(getSessionOrThrow).mockResolvedValue(mockValidSession);
  });

  it("should return 401 if getSessionOrThrow fails", async () => {
    const mockErrorResponse = new Response(null, { status: 401 });
    vi.mocked(createErrorResponseWithTimestamp).mockReturnValueOnce(
      mockErrorResponse,
    );
    vi.mocked(getSessionOrThrow).mockRejectedValueOnce(new Error("No session"));

    const authorizedRequest = sendAuthorizedRequestWithBearer(
      "https://api-endpoint",
      "GET",
      undefined,
    );
    const response = await authorizedRequest;

    expect(response).toBe(mockErrorResponse);
    expect(createErrorResponseWithTimestamp).toHaveBeenCalledWith(null, 401);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should call createErrorResponseWithTimestamp if fetch fails", async () => {
    const mockErrorResponse = new Response(null, { status: 500 });
    vi.mocked(createErrorResponseWithTimestamp).mockReturnValueOnce(
      mockErrorResponse,
    );

    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    const authorizedRequest = sendAuthorizedRequestWithBearer(
      "https://api-endpoint",
      "GET",
      undefined,
    );
    const response = await authorizedRequest;
    expect(response).toBe(mockErrorResponse);
    expect(createErrorResponseWithTimestamp).toHaveBeenCalledWith();
  });

  it("should call createErrorResponseWithTimestamp when response is not ok", async () => {
    const mockErrorResponse = new Response("Forbidden", { status: 403 });
    vi.mocked(createErrorResponseWithTimestamp).mockReturnValueOnce(
      mockErrorResponse,
    );

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      text: vi.fn().mockResolvedValue("Forbidden"),
    } as any);

    const authorizedRequest = sendAuthorizedRequestWithBearer(
      "https://api-endpoint",
      "GET",
      undefined,
    );
    const response = await authorizedRequest;

    expect(response).toBe(mockErrorResponse);
    expect(createErrorResponseWithTimestamp).toHaveBeenCalledWith(
      "Forbidden",
      403,
    );
  });

  it("should call createErrorResponseWithTimestamp when fetch throws an exception", async () => {
    const mockErrorResponse = new Response(null, { status: 500 });
    vi.mocked(createErrorResponseWithTimestamp).mockReturnValueOnce(
      mockErrorResponse,
    );

    vi.mocked(fetch).mockRejectedValueOnce(new Error("Connection timeout"));

    const authorizedRequest = sendAuthorizedRequestWithBearer(
      "https://api-endpoint",
      "POST",
      { data: "test" },
    );
    const response = await authorizedRequest;

    expect(response).toBe(mockErrorResponse);
    expect(createErrorResponseWithTimestamp).toHaveBeenCalledWith();
  });

  it("should correctly set Authorization header with Bearer token", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
    } as any);

    const authorizedRequest = sendAuthorizedRequestWithBearer(
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
    const mockErrorResponse = new Response("Forbidden", { status: 403 });
    vi.mocked(createErrorResponseWithTimestamp).mockReturnValueOnce(
      mockErrorResponse,
    );

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      text: vi.fn().mockResolvedValue("Forbidden"),
    } as any);

    const authorizedRequest = sendAuthorizedRequestWithBearer(
      "https://api-endpoint",
      "GET",
      undefined,
    );

    const response = await authorizedRequest;

    expect(response).toBe(mockErrorResponse);
    expect(createErrorResponseWithTimestamp).toHaveBeenCalledWith(
      "Forbidden",
      403,
    );
  });

  it("should handle response with status 204 properly", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 204,
      statusText: "No Content",
    } as any);

    const authorizedRequest = sendAuthorizedRequestWithBearer(
      "https://api-endpoint",
      "DELETE",
      undefined,
    );

    const response = await authorizedRequest;

    expect(response?.status).toBe(204);
  });
});
