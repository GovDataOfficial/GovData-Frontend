import { describe, expect, test, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

import { withHeadersMiddleware } from "@/middlewares/withHeadersMiddleware";

vi.spyOn(NextResponse, "redirect");

vi.mock("@/app/_lib/getData", async () => {
  return {
    fetchMetadata: vi.fn().mockResolvedValue({
      resources: [{ url: "www.resource.com" }],
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
