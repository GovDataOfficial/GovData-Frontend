// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import { createErrorResponseWithTimestamp } from "../_lib/errorResponseWithTimestamp";

describe("createErrorResponseWithTimestamp", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should create a response with default 500 status", () => {
    const response = createErrorResponseWithTimestamp();
    expect(response.status).toBe(500);
  });

  it("should create a response with custom status", () => {
    const response = createErrorResponseWithTimestamp(null, 401);
    expect(response.status).toBe(401);
  });

  it("should create a response with body", () => {
    const response = createErrorResponseWithTimestamp("Error message", 400);
    expect(response.status).toBe(400);
  });

  it("should include X-Error-Timestamp header with ISO timestamp", () => {
    const fixedDate = new Date("2026-01-27T12:00:00.000Z");
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);

    const response = createErrorResponseWithTimestamp(null, 401);

    expect(response.status).toBe(401);
    const timestamp = response.headers.get("X-Error-Timestamp");
    expect(timestamp).toBe("2026-01-27T12:00:00.000Z");

    vi.useRealTimers();
  });

  it("should include X-Error-Timestamp header for different status codes", () => {
    const fixedDate = new Date("2026-01-27T14:30:45.123Z");
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);

    const response500 = createErrorResponseWithTimestamp();
    expect(response500.headers.get("X-Error-Timestamp")).toBe(
      "2026-01-27T14:30:45.123Z",
    );

    const response404 = createErrorResponseWithTimestamp(null, 404);
    expect(response404.headers.get("X-Error-Timestamp")).toBe(
      "2026-01-27T14:30:45.123Z",
    );

    vi.useRealTimers();
  });

  it("should handle null body correctly", () => {
    const response = createErrorResponseWithTimestamp(null, 500);
    expect(response.status).toBe(500);
    expect(response.headers.get("X-Error-Timestamp")).toBeDefined();
  });

  it("should handle string body correctly", async () => {
    const errorBody = "Server error occurred";
    const response = createErrorResponseWithTimestamp(errorBody, 500);
    const body = await response.text();
    expect(body).toBe(errorBody);
    expect(response.headers.get("X-Error-Timestamp")).toBeDefined();
  });
});
