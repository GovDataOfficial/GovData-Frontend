import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

import { useCodeContentFetch } from "@/app/_lib/hooks/useCodeContentFetch";

describe("useCodeContentFetch", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return initial state when metaDataName is empty", () => {
    const { result } = renderHook(() => useCodeContentFetch("", "json"));

    expect(result.current.codeContent).toBe(undefined);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasError).toBe(false);
    expect(result.current.liveRegionMessage).toBe("");
  });

  it("should fetch and return code content successfully", async () => {
    const mockContent = "mock code content";
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: vi.fn().mockResolvedValueOnce(mockContent),
    } as any);

    const { result } = renderHook(() =>
      useCodeContentFetch("test-metadata", "json"),
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.codeContent).toBe(mockContent);
    expect(result.current.hasError).toBe(false);
    expect(result.current.liveRegionMessage).toBe(
      "Die Metadaten im search.details.infobox.metaDataDownload.modal.format.json.name Format konnten erfolgreich geladen werden und werden nun in der Vorschau angezeigt.",
    );
    expect(fetch).toHaveBeenCalledWith(
      "/api/metadata/test-metadata?suffix=json",
    );
  });

  it("should handle fetch error correctly", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    } as any);

    const { result } = renderHook(() =>
      useCodeContentFetch("test-metadata", "xml"),
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.codeContent).toBe(undefined);
    expect(result.current.hasError).toBe(true);
    expect(result.current.liveRegionMessage).toBe("");
  });

  it("should handle network error correctly", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() =>
      useCodeContentFetch("test-metadata", "json"),
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.codeContent).toBe(undefined);
    expect(result.current.hasError).toBe(true);
    expect(result.current.liveRegionMessage).toBe("");
  });

  it("should encode suffix parameter correctly", async () => {
    const mockContent = "mock content";
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: vi.fn().mockResolvedValueOnce(mockContent),
    } as any);

    renderHook(() => useCodeContentFetch("test-metadata", "rdf+xml"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/metadata/test-metadata?suffix=rdf%2Bxml",
      );
    });
  });

  it("should refetch when metaDataName changes", async () => {
    const mockContent1 = "content 1";
    const mockContent2 = "content 2";

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValueOnce(mockContent1),
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValueOnce(mockContent2),
      } as any);

    const { result, rerender } = renderHook(
      ({ metaDataName, suffix }) => useCodeContentFetch(metaDataName, suffix),
      {
        initialProps: { metaDataName: "metadata1", suffix: "json" },
      },
    );

    await waitFor(() => {
      expect(result.current.codeContent).toBe(mockContent1);
    });

    rerender({ metaDataName: "metadata2", suffix: "json" });

    await waitFor(() => {
      expect(result.current.codeContent).toBe(mockContent2);
    });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "/api/metadata/metadata1?suffix=json",
    );
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "/api/metadata/metadata2?suffix=json",
    );
  });

  it("should refetch when suffix changes", async () => {
    const mockContentJson = "json content";
    const mockContentXml = "xml content";

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValueOnce(mockContentJson),
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValueOnce(mockContentXml),
      } as any);

    const { result, rerender } = renderHook(
      ({ metaDataName, suffix }) => useCodeContentFetch(metaDataName, suffix),
      {
        initialProps: { metaDataName: "test-metadata", suffix: "json" },
      },
    );

    await waitFor(() => {
      expect(result.current.codeContent).toBe(mockContentJson);
    });

    rerender({ metaDataName: "test-metadata", suffix: "xml" });

    await waitFor(() => {
      expect(result.current.codeContent).toBe(mockContentXml);
    });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "/api/metadata/test-metadata?suffix=json",
    );
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "/api/metadata/test-metadata?suffix=xml",
    );
  });

  it("should not update state if component unmounts during fetch", async () => {
    let resolvePromise: (value: any) => void;
    const fetchPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(fetch).mockReturnValueOnce(fetchPromise as any);

    const { result, unmount } = renderHook(() =>
      useCodeContentFetch("test-metadata", "json"),
    );

    expect(result.current.isLoading).toBe(true);

    // Unmount before fetch completes
    unmount();

    // Resolve the fetch after unmounting
    resolvePromise!({
      ok: true,
      text: vi.fn().mockResolvedValueOnce("content after unmount"),
    });

    // Wait a bit to ensure any async operations complete
    await new Promise((resolve) => setTimeout(resolve, 10));

    // The state should remain as it was when unmounted
    expect(result.current.isLoading).toBe(true);
    expect(result.current.codeContent).toBe(undefined);
  });

  it("should clear previous content when error occurs", async () => {
    const mockContent = "previous content";

    // First successful fetch
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: vi.fn().mockResolvedValueOnce(mockContent),
    } as any);

    const { result, rerender } = renderHook(
      ({ metaDataName, suffix }) => useCodeContentFetch(metaDataName, suffix),
      {
        initialProps: { metaDataName: "metadata1", suffix: "json" },
      },
    );

    await waitFor(() => {
      expect(result.current.codeContent).toBe(mockContent);
      expect(result.current.hasError).toBe(false);
    });

    // Second fetch with error
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Server Error",
    } as any);

    rerender({ metaDataName: "metadata2", suffix: "json" });

    await waitFor(() => {
      expect(result.current.hasError).toBe(true);
    });

    expect(result.current.codeContent).toBe(undefined);
    expect(result.current.liveRegionMessage).toBe("");
  });

  it("should generate correct live region message for different suffixes", async () => {
    const mockContent = "content";
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue(mockContent),
    } as any);

    // Test with ttl suffix (which has translation)
    const { result: resultTtl } = renderHook(() =>
      useCodeContentFetch("test-metadata", "ttl"),
    );

    await waitFor(() => {
      expect(resultTtl.current.liveRegionMessage).toBe(
        "Die Metadaten im Turtle (TTL) Format konnten erfolgreich geladen werden und werden nun in der Vorschau angezeigt.",
      );
    });
  });
});
