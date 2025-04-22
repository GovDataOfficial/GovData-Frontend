import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

import { useFetchPreviewData } from "@/app/suche/_components/ResourceTable/ResourcePreview/useFetchPreviewData";

describe("useFetchPreviewData", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should return data when the API call is successful", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data: "valid data" }),
    } as Response);

    const { result } = renderHook(() =>
      useFetchPreviewData("valid-url", "json"),
    );
    expect(result.current.isLoading).toBe(true);

    await waitFor(() =>
      expect(result.current.data).toEqual({ data: "valid data" }),
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should return an error when the API call returns no content", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      status: 204,
      json: () => Promise.resolve(null),
    } as Response);

    const { result } = renderHook(() =>
      useFetchPreviewData("no-content-url", "json"),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("Empty data");
    expect(result.current.data).toBeNull();
  });

  it("should return an error when the API call fails", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: "Internal Server Error" }),
    } as Response);

    const { result } = renderHook(() =>
      useFetchPreviewData("invalid-url", "json"),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Error fetching preview data from API");
  });

  it("should return an error when the response is invalid JSON", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.reject(new Error("Invalid JSON")),
    } as Response);

    const { result } = renderHook(() =>
      useFetchPreviewData("invalid-json-url", "json"),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Error fetching preview data from API");
  });

  it("should return an error when the content type is unexpected", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      status: 200,
      headers: {
        get: () => "text/html",
      },
      json: () => Promise.resolve({}),
    } as unknown as Response);

    const { result } = renderHook(() =>
      useFetchPreviewData("unexpected-content-type-url", "geojson"),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Error fetching preview data from API");
  });
});
