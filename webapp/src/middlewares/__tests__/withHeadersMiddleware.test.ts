import { describe, expect, it, test, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

import { withHeadersMiddleware } from "@/middlewares/withHeadersMiddleware";

vi.spyOn(NextResponse, "redirect");

vi.mock("@/app/_lib/getData", async () => {
  return {
    fetchMetadata: vi.fn().mockResolvedValue({
      resources: [{ url: "https://www.resource.com" }],
    }),
  };
});

describe("middleware Headers", () => {
  const url = new URL("https://test.de/");
  const request = new NextRequest(url);

  test("should set default headers on response", async () => {
    const response = new NextResponse();
    const middlewareResponse = await withHeadersMiddleware(request, response);

    expect(middlewareResponse).toBeUndefined();

    const headers = response.headers;
    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("Cross-Origin-Opener-Policy")).toBe("same-origin");
    expect(headers.get("Cross-Origin-Resource-Policy")).toBe("same-origin");
    expect(headers.get("Referrer-Policy")).toBe("no-referrer");
    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
    expect(headers.get("X-Permitted-Cross-Domain-Policies")).toBe("none");
  });

  test("should set default script-src CSP headers on response", async () => {
    const response = new NextResponse();
    const middlewareResponse = await withHeadersMiddleware(request, response);

    expect(middlewareResponse).toBeUndefined();

    const cspHeaders = response.headers.get("Content-Security-Policy");
    const cspHeadersSplit = cspHeaders?.split(";");

    const scriptSrc = cspHeadersSplit?.find((csp) =>
      csp.includes("script-src"),
    );
    expect(scriptSrc).toBeDefined();
    expect(scriptSrc).toContain("'self'");
    expect(scriptSrc).toContain("'unsafe-inline'");
    expect(scriptSrc).not.toContain("'unsafe-eval'");
  });

  test("should set connect-src resource url headers on response when on details page", async () => {
    const response = new NextResponse();
    const request = new NextRequest(
      new URL("https://test.de/suche/daten/example"),
    );
    const middlewareResponse = await withHeadersMiddleware(request, response);

    expect(middlewareResponse).toBeUndefined();

    const cspHeaders = response.headers.get("Content-Security-Policy");
    const cspHeadersSplit = cspHeaders?.split(";");

    const connectSrc = cspHeadersSplit?.find((csp) =>
      csp.includes("connect-src"),
    );
    expect(connectSrc).toBeDefined();
    expect(connectSrc).toContain("www.resource.com");
  });

  test("should consolidate multiple URLs from same origin into single CSP entry", async () => {
    // Mock fetchMetadata to return multiple URLs from the same origin
    const { fetchMetadata } = await import("@/app/_lib/getData");
    vi.mocked(fetchMetadata).mockResolvedValueOnce({
      resources: [
        { url: "https://example.com/resource1.json" },
        { url: "https://example.com/resource2.json" },
        { url: "https://example.com/api/data.json" },
        { url: "https://other.com/data.json" },
      ],
    } as any);

    const response = new NextResponse();
    const request = new NextRequest(
      new URL("https://test.de/suche/daten/example"),
    );
    await withHeadersMiddleware(request, response);

    const cspHeaders = response.headers.get("Content-Security-Policy");
    const cspHeadersSplit = cspHeaders?.split(";");
    const connectSrc = cspHeadersSplit?.find((csp) =>
      csp.includes("connect-src"),
    );

    expect(connectSrc).toBeDefined();
    // Should contain only the origin, not all individual URLs
    expect(connectSrc).toContain("https://example.com");
    expect(connectSrc).toContain("https://other.com");
    // Should not contain the full paths
    expect(connectSrc).not.toContain("/resource1.json");
    expect(connectSrc).not.toContain("/resource2.json");
    expect(connectSrc).not.toContain("/api/data.json");
  });

  test("should handle URLs with different ports as separate origins", async () => {
    const { fetchMetadata } = await import("@/app/_lib/getData");
    vi.mocked(fetchMetadata).mockResolvedValueOnce({
      resources: [
        { url: "https://example.com:443/resource1.json" },
        { url: "https://example.com:8080/resource2.json" },
        { url: "https://example.com/resource3.json" },
      ],
    } as any);

    const response = new NextResponse();
    const request = new NextRequest(
      new URL("https://test.de/suche/daten/example"),
    );
    await withHeadersMiddleware(request, response);

    const cspHeaders = response.headers.get("Content-Security-Policy");
    const cspHeadersSplit = cspHeaders?.split(";");
    const connectSrc = cspHeadersSplit?.find((csp) =>
      csp.includes("connect-src"),
    );

    expect(connectSrc).toBeDefined();
    // Port 8080 should be included as it's non-default
    expect(connectSrc).toContain("https://example.com:8080");
    // Default HTTPS port (443) and no port should result in same origin
    expect(connectSrc).toContain("https://example.com");
  });

  test("should ignore invalid URLs when extracting origins", async () => {
    const { fetchMetadata } = await import("@/app/_lib/getData");
    vi.mocked(fetchMetadata).mockResolvedValueOnce({
      resources: [
        { url: "https://valid.com/resource.json" },
        { url: "not-a-valid-url" },
        { url: "ftp://another-valid.com/data" },
        { url: "" },
      ],
    } as any);

    const response = new NextResponse();
    const request = new NextRequest(
      new URL("https://test.de/suche/daten/example"),
    );
    await withHeadersMiddleware(request, response);

    const cspHeaders = response.headers.get("Content-Security-Policy");
    const cspHeadersSplit = cspHeaders?.split(";");
    const connectSrc = cspHeadersSplit?.find((csp) =>
      csp.includes("connect-src"),
    );

    expect(connectSrc).toBeDefined();
    // Valid URLs should be included
    expect(connectSrc).toContain("https://valid.com");
    expect(connectSrc).toContain("ftp://another-valid.com");
    // Invalid URLs should not crash or appear
    expect(connectSrc).not.toContain("not-a-valid-url");
  });

  test("should optimize CSP by reducing duplicate origins from resource URLs", async () => {
    const { fetchMetadata } = await import("@/app/_lib/getData");
    vi.mocked(fetchMetadata).mockResolvedValueOnce({
      resources: [
        { url: "https://cdn.example.com/file1.json" },
        { url: "https://cdn.example.com/file2.json" },
        { url: "https://cdn.example.com/file3.json" },
        { url: "https://cdn.example.com/file4.json" },
        { url: "https://cdn.example.com/file5.json" },
      ],
    } as any);

    const response = new NextResponse();
    const request = new NextRequest(
      new URL("https://test.de/suche/daten/example"),
    );
    await withHeadersMiddleware(request, response);

    const cspHeaders = response.headers.get("Content-Security-Policy");
    const cspHeadersSplit = cspHeaders?.split(";");
    const connectSrc = cspHeadersSplit?.find((csp) =>
      csp.includes("connect-src"),
    );

    expect(connectSrc).toBeDefined();
    // Should contain the origin only once
    const originCount = (
      connectSrc?.match(/https:\/\/cdn\.example\.com/g) || []
    ).length;
    expect(originCount).toBe(1);
  });

  test("should not include empty entries from env vars", async () => {
    // Mock environment variables with empty entries
    vi.stubEnv(
      "csp_extra_script_src",
      '["https://example.com", "", "  ", "https://another.com"]',
    );
    vi.stubEnv("csp_extra_img_src", '["", "https://images.com", "   "]');

    // Reimport the module to get fresh instance with mocked env vars
    await vi.resetModules();
    const { withHeadersMiddleware } = await import(
      "@/middlewares/withHeadersMiddleware"
    );

    const response = new NextResponse();
    await withHeadersMiddleware(request, response);

    const cspHeaders = response.headers.get("Content-Security-Policy");
    const cspHeadersSplit = cspHeaders?.split(";");

    const scriptSrc = cspHeadersSplit?.find((csp) =>
      csp.includes("script-src"),
    );
    const imgSrc = cspHeadersSplit?.find((csp) => csp.includes("img-src"));

    // Verify that valid URLs from env vars are included
    expect(scriptSrc).toContain("https://example.com");
    expect(scriptSrc).toContain("https://another.com");
    expect(imgSrc).toContain("https://images.com");

    // Verify that empty entries and whitespace-only entries are filtered out
    // The addExtraCSP function should filter out "", "  " entries
    expect(scriptSrc).not.toMatch(/script-src[^;]*\s''\s/); // No empty string entries
    expect(scriptSrc).not.toMatch(/script-src[^;]*\s\s/); // No whitespace-only entries
    expect(imgSrc).not.toMatch(/img-src[^;]*\s''\s/); // No empty string entries
    expect(imgSrc).not.toMatch(/img-src[^;]*\s\s/); // No whitespace-only entries

    // Clean up
    vi.unstubAllEnvs();
  });
});
