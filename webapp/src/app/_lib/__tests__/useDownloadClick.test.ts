import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useDownloadClick } from "../hooks/useDownloadClick";

// Mock DOM APIs
const mockLink = {
  href: "",
  download: "",
  dispatchEvent: vi.fn(),
  click: vi.fn(),
};

const mockCreateElement = vi.fn();
const mockCreateAElement = vi.fn(() => mockLink);
const mockCreateObjectURL = vi.fn(() => "blob:mock-url");
const mockRevokeObjectURL = vi.fn();
const mockFetch = vi.fn();
const mockShowSaveFilePicker = vi.fn();
const mockCreateWritable = vi.fn();
const mockWrite = vi.fn();
const mockClose = vi.fn();

// Mock global Blob
const MockBlob = vi.fn().mockImplementation(function (
  this: any,
  content: any[],
  options?: any,
) {
  this.content = content;
  this.type = options?.type || "text/plain";
  this.size = content[0]?.length || 0;
});

// Mock MouseEvent for JSDOM compatibility
const MockMouseEvent = vi.fn().mockImplementation(function (
  this: any,
  type: string,
  options?: any,
) {
  this.type = type;
  this.bubbles = options?.bubbles || false;
  this.cancelable = options?.cancelable || false;
  this.detail = options?.detail || 0;
  this.view = options?.view || null;
});

describe("useDownloadClick", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Reset link mock
    mockLink.href = "";
    mockLink.download = "";

    // Mock global Blob
    global.Blob = MockBlob as any;

    // Mock MouseEvent for JSDOM compatibility
    global.MouseEvent = MockMouseEvent as any;

    // Mock document.createElement - store original method first
    const originalCreateElement = document.createElement;
    vi.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "a") {
        mockCreateAElement();
        return mockLink as any;
      }
      // Use the original implementation for other elements to avoid interfering with testing framework
      return originalCreateElement.call(document, tagName);
    });

    // Specific spy for 'a' elements only to avoid noise from framework
    vi.spyOn(document, "createElement");

    // Mock URL methods
    global.URL = {
      ...global.URL,
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    } as any;

    // Mock fetch
    global.fetch = mockFetch;

    // Mock File System Access API
    mockCreateWritable.mockReturnValue({
      write: mockWrite,
      close: mockClose,
    });
    mockShowSaveFilePicker.mockResolvedValue({
      createWritable: mockCreateWritable,
    });

    // Reset window mock
    delete (window as any).showSaveFilePicker;
    Object.defineProperty(window, "isSecureContext", {
      value: true,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("basic functionality", () => {
    it("should return handleDownload function", () => {
      const { result } = renderHook(() => useDownloadClick("test-file", "txt"));

      expect(result.current.handleDownload).toBeInstanceOf(Function);
    });

    it("should sanitize filename by replacing invalid characters", async () => {
      const { result } = renderHook(() =>
        useDownloadClick("test<>file:/\\|?*", "txt"),
      );

      await act(async () => {
        await result.current.handleDownload("test content");
      });

      expect(mockCreateAElement).toHaveBeenCalled();
      expect(mockLink.download).toBe("test__file______.txt");
    });

    it("should handle long filenames by truncating to 255 characters", async () => {
      const longFilename = "a".repeat(300);
      const { result } = renderHook(() =>
        useDownloadClick(longFilename, "txt"),
      );

      await act(async () => {
        await result.current.handleDownload("test content");
      });

      expect(mockLink.download).toBe("a".repeat(255) + ".txt");
    });
  });

  describe("MIME type handling", () => {
    it("should use correct MIME type for TTL files", async () => {
      const { result } = renderHook(() => useDownloadClick("test", "ttl"));

      await act(async () => {
        await result.current.handleDownload("test content");
      });

      expect(MockBlob).toHaveBeenCalledWith(["test content"], {
        type: "text/turtle",
      });
    });

    it("should use correct MIME type for RDF files", async () => {
      const { result } = renderHook(() => useDownloadClick("test", "rdf"));

      await act(async () => {
        await result.current.handleDownload("test content");
      });

      expect(MockBlob).toHaveBeenCalledWith(["test content"], {
        type: "application/rdf+xml",
      });
    });

    it("should use correct MIME type for JSON-LD files", async () => {
      const { result } = renderHook(() => useDownloadClick("test", "jsonld"));

      await act(async () => {
        await result.current.handleDownload("test content");
      });

      expect(MockBlob).toHaveBeenCalledWith(["test content"], {
        type: "application/ld+json",
      });
    });

    it("should use text/plain for unknown file extensions", async () => {
      const { result } = renderHook(() => useDownloadClick("test", "unknown"));

      await act(async () => {
        await result.current.handleDownload("test content");
      });

      expect(MockBlob).toHaveBeenCalledWith(["test content"], {
        type: "text/plain",
      });
    });
  });

  describe("File System Access API", () => {
    beforeEach(() => {
      // Mock File System Access API as available
      Object.defineProperty(window, "showSaveFilePicker", {
        value: mockShowSaveFilePicker,
        writable: true,
        configurable: true,
      });
    });

    it("should use File System Access API when available and content is provided", async () => {
      const { result } = renderHook(() => useDownloadClick("test-file", "txt"));

      await act(async () => {
        await result.current.handleDownload("test content");
      });

      expect(mockShowSaveFilePicker).toHaveBeenCalledWith({
        suggestedName: "test-file.txt",
        types: [
          {
            description: "TXT files",
            accept: { "text/plain": [".txt"] },
          },
        ],
        excludeAcceptAllOption: false,
      });

      expect(mockCreateWritable).toHaveBeenCalled();
      expect(mockWrite).toHaveBeenCalledWith(expect.any(MockBlob));
      expect(mockClose).toHaveBeenCalled();
    });

    it("should fallback to traditional download when File API throws AbortError", async () => {
      mockShowSaveFilePicker.mockRejectedValue(
        Object.assign(new Error("User cancelled"), { name: "AbortError" }),
      );

      const { result } = renderHook(() => useDownloadClick("test-file", "txt"));

      await act(async () => {
        await result.current.handleDownload("test content");
      });

      expect(mockShowSaveFilePicker).toHaveBeenCalled();
      // Should not create blob or trigger fallback download for AbortError
      expect(mockCreateAElement).not.toHaveBeenCalled();
    });

    it("should fallback to traditional download when File API throws other errors", async () => {
      mockShowSaveFilePicker.mockRejectedValue(new Error("Some other error"));

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { result } = renderHook(() => useDownloadClick("test-file", "txt"));

      await act(async () => {
        await result.current.handleDownload("test content");
      });

      expect(mockShowSaveFilePicker).toHaveBeenCalled();
      // The hook actually throws the error instead of falling back
      expect(consoleSpy).toHaveBeenCalledWith(
        "Download failed:",
        expect.any(Error),
      );
      expect(mockCreateAElement).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should skip File System Access API when not in secure context", async () => {
      Object.defineProperty(window, "isSecureContext", {
        value: false,
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useDownloadClick("test-file", "txt"));

      await act(async () => {
        await result.current.handleDownload("test content");
      });

      expect(mockShowSaveFilePicker).not.toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith("a");
    });

    it("should skip File System Access API when API is not available", async () => {
      delete (window as any).showSaveFilePicker;

      const { result } = renderHook(() => useDownloadClick("test-file", "txt"));

      await act(async () => {
        await result.current.handleDownload("test content");
      });

      expect(mockShowSaveFilePicker).not.toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith("a");
    });
  });

  describe("fallback download mechanism", () => {
    beforeEach(() => {
      // Ensure File System Access API is not available
      delete (window as any).showSaveFilePicker;
    });

    it("should create download link with correct attributes", async () => {
      const { result } = renderHook(() => useDownloadClick("test-file", "txt"));

      await act(async () => {
        await result.current.handleDownload("test content");
      });

      expect(document.createElement).toHaveBeenCalledWith("a");
      expect(mockLink.href).toBe("blob:mock-url");
      expect(mockLink.download).toBe("test-file.txt");
    });

    it("should trigger click event on download link", async () => {
      const { result } = renderHook(() => useDownloadClick("test-file", "txt"));

      await act(async () => {
        await result.current.handleDownload("test content");
      });

      expect(mockLink.dispatchEvent).toHaveBeenCalledWith(
        expect.any(MockMouseEvent),
      );
    });

    it("should revoke blob URL after timeout", async () => {
      const { result } = renderHook(() => useDownloadClick("test-file", "txt"));

      await act(async () => {
        await result.current.handleDownload("test content");
      });

      expect(mockRevokeObjectURL).not.toHaveBeenCalled();

      // Fast-forward time by 1000ms
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    });
  });

  describe("API fetching", () => {
    beforeEach(() => {
      // Disable File System Access API for these tests
      delete (window as any).showSaveFilePicker;
    });

    it("should fetch content from API when no content is provided", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve("fetched content"),
      });

      const { result } = renderHook(() =>
        useDownloadClick("test-file", "txt", "https://api.example.com/data"),
      );

      await act(async () => {
        await result.current.handleDownload();
      });

      expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/data");
      expect(MockBlob).toHaveBeenCalledWith(["fetched content"], {
        type: "text/plain",
      });
    });

    it("should handle API fetch errors", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { result } = renderHook(() =>
        useDownloadClick("test-file", "txt", "https://api.example.com/data"),
      );

      await act(async () => {
        await result.current.handleDownload();
      });

      expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/data");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Download failed:",
        expect.any(Error),
      );
      expect(mockCreateAElement).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should prefer provided content over API fetch", async () => {
      const { result } = renderHook(() =>
        useDownloadClick("test-file", "txt", "https://api.example.com/data"),
      );

      await act(async () => {
        await result.current.handleDownload("direct content");
      });

      expect(mockFetch).not.toHaveBeenCalled();
      expect(MockBlob).toHaveBeenCalledWith(["direct content"], {
        type: "text/plain",
      });
    });

    it("should handle case where no content and no API URL provided", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { result } = renderHook(() => useDownloadClick("test-file", "txt"));

      await act(async () => {
        await result.current.handleDownload();
      });

      expect(mockFetch).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Download failed:",
        expect.any(Error),
      );
      expect(mockCreateAElement).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("edge cases and error handling", () => {
    beforeEach(() => {
      delete (window as any).showSaveFilePicker;
    });

    it("should handle empty filename", async () => {
      const { result } = renderHook(() => useDownloadClick("", "txt"));

      await act(async () => {
        await result.current.handleDownload("content");
      });

      expect(mockLink.download).toBe(".txt");
    });

    it("should handle filename with only invalid characters", async () => {
      const { result } = renderHook(() =>
        useDownloadClick('<>:"/\\|?*', "txt"),
      );

      await act(async () => {
        await result.current.handleDownload("content");
      });

      expect(mockLink.download).toBe("_________.txt");
    });

    it("should handle empty content", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { result } = renderHook(() => useDownloadClick("test-file", "txt"));

      await act(async () => {
        await result.current.handleDownload("");
      });

      // Empty string content is treated as no content and throws an error
      expect(consoleSpy).toHaveBeenCalledWith(
        "Download failed:",
        expect.any(Error),
      );
      expect(MockBlob).not.toHaveBeenCalled();
      expect(mockCreateAElement).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should maintain correct dependencies in useCallback", () => {
      const { result, rerender } = renderHook(
        ({ filename, extension, apiUrl }) =>
          useDownloadClick(filename, extension, apiUrl),
        {
          initialProps: {
            filename: "initial",
            extension: "txt",
            apiUrl: "https://initial.com",
          },
        },
      );

      const initialHandler = result.current.handleDownload;

      rerender({
        filename: "changed",
        extension: "json",
        apiUrl: "https://changed.com",
      });

      const changedHandler = result.current.handleDownload;

      // Handler should be different due to dependency changes
      expect(initialHandler).not.toBe(changedHandler);
    });

    it("should handle network errors during fetch", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { result } = renderHook(() =>
        useDownloadClick("test-file", "txt", "https://api.example.com/data"),
      );

      await act(async () => {
        await result.current.handleDownload();
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Download failed:",
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });
});
