// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/metadata/[...slug]/route";

describe("GET /api/metadata/[...slug]", () => {
  const mockFetch = vi.fn();
  const baseUrl = "https://test-backend.com";

  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("BE_GD_CKAN_DATASET_URL", baseUrl);
    globalThis.fetch = mockFetch;
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it("should return 200 and metadata content for valid request", async () => {
    const mockContent = "mock metadata content";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(mockContent),
    });

    const request = new Request(
      "http://localhost/api/metadata/test-dataset?suffix=xml",
    );
    const params = Promise.resolve({ slug: ["test-dataset"] });

    const response = await GET(request, { params });

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(mockContent);
    expect(response.headers.get("Content-Type")).toBe("text/plain");
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=300");
    expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}/test-dataset.xml`);
  });

  it("should handle nested slug paths correctly", async () => {
    const mockContent = "nested metadata content";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(mockContent),
    });

    const request = new Request(
      "http://localhost/api/metadata/category/subcategory/dataset?suffix=json",
    );
    const params = Promise.resolve({
      slug: ["category", "subcategory", "dataset"],
    });

    const response = await GET(request, { params });

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(mockContent);
    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/category/subcategory/dataset.json`,
    );
  });

  it("should return 400 when metaDataName is missing", async () => {
    const request = new Request("http://localhost/api/metadata/?suffix=xml");
    const params = Promise.resolve({ slug: [] });

    const response = await GET(request, { params });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe(
      "Missing metaDataName parameter or suffix query parameter.",
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should return 400 when suffix query parameter is missing", async () => {
    const request = new Request("http://localhost/api/metadata/test-dataset");
    const params = Promise.resolve({ slug: ["test-dataset"] });

    const response = await GET(request, { params });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe(
      "Missing metaDataName parameter or suffix query parameter.",
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should return 400 when both metaDataName and suffix are missing", async () => {
    const request = new Request("http://localhost/api/metadata/");
    const params = Promise.resolve({ slug: [] });

    const response = await GET(request, { params });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe(
      "Missing metaDataName parameter or suffix query parameter.",
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should return backend status when fetch fails with 404", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const request = new Request(
      "http://localhost/api/metadata/nonexistent?suffix=xml",
    );
    const params = Promise.resolve({ slug: ["nonexistent"] });

    const response = await GET(request, { params });

    expect(response.status).toBe(404);
    expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}/nonexistent.xml`);
  });

  it("should return backend status when fetch fails with 500", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const request = new Request(
      "http://localhost/api/metadata/error-dataset?suffix=json",
    );
    const params = Promise.resolve({ slug: ["error-dataset"] });

    const response = await GET(request, { params });

    expect(response.status).toBe(500);
    expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}/error-dataset.json`);
  });

  it("should handle network errors and return 500", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const request = new Request(
      "http://localhost/api/metadata/test-dataset?suffix=xml",
    );
    const params = Promise.resolve({ slug: ["test-dataset"] });

    const response = await GET(request, { params });

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Internal server error");
  });

  it("should handle different file suffixes correctly", async () => {
    const testCases = [
      { suffix: "xml", expectedUrl: `${baseUrl}/test.xml` },
      { suffix: "json", expectedUrl: `${baseUrl}/test.json` },
      { suffix: "rdf", expectedUrl: `${baseUrl}/test.rdf` },
      { suffix: "ttl", expectedUrl: `${baseUrl}/test.ttl` },
    ];

    for (const testCase of testCases) {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(`content for ${testCase.suffix}`),
      });

      const request = new Request(
        `http://localhost/api/metadata/test?suffix=${testCase.suffix}`,
      );
      const params = Promise.resolve({ slug: ["test"] });

      await GET(request, { params });

      expect(mockFetch).toHaveBeenCalledWith(testCase.expectedUrl);
      mockFetch.mockClear();
    }
  });

  it("should handle empty slug array as missing metaDataName", async () => {
    const request = new Request("http://localhost/api/metadata/?suffix=xml");
    const params = Promise.resolve({ slug: [] });

    const response = await GET(request, { params });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe(
      "Missing metaDataName parameter or suffix query parameter.",
    );
  });

  it("should handle special characters in slug", async () => {
    const mockContent = "special chars content";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(mockContent),
    });

    const request = new Request(
      "http://localhost/api/metadata/test-with-dashes_and_underscores?suffix=xml",
    );
    const params = Promise.resolve({
      slug: ["test-with-dashes_and_underscores"],
    });

    const response = await GET(request, { params });

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(
      `${baseUrl}/test-with-dashes_and_underscores.xml`,
    );
  });

  it("should handle fetch response with empty content", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(""),
    });

    const request = new Request(
      "http://localhost/api/metadata/empty-dataset?suffix=xml",
    );
    const params = Promise.resolve({ slug: ["empty-dataset"] });

    const response = await GET(request, { params });

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("");
  });

  it("should preserve response status from backend when not ok", async () => {
    const statusCodes = [400, 401, 403, 404, 500, 502, 503];

    for (const statusCode of statusCodes) {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: statusCode,
      });

      const request = new Request(
        `http://localhost/api/metadata/test?suffix=xml`,
      );
      const params = Promise.resolve({ slug: ["test"] });

      const response = await GET(request, { params });

      expect(response.status).toBe(statusCode);
      mockFetch.mockClear();
    }
  });

  it("should handle URL encoding in slug parameters", async () => {
    const mockContent = "url encoded content";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(mockContent),
    });

    const request = new Request(
      "http://localhost/api/metadata/test%20with%20spaces?suffix=xml",
    );
    const params = Promise.resolve({ slug: ["test with spaces"] });

    const response = await GET(request, { params });

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}/test with spaces.xml`);
  });
});
