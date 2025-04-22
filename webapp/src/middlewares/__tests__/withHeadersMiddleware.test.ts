// @vitest-environment node

import { describe, expect, test, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

import { withHeadersMiddleware } from "@/middlewares/withHeadersMiddleware";

vi.spyOn(NextResponse, "redirect");

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

  test("should set connect-src wildcard CSP headers on response when on details page", async () => {
    const response = new NextResponse();
    const request = new NextRequest(new URL("https://test.de/suche/daten/"));
    const middlewareResponse = await withHeadersMiddleware(request, response);

    expect(middlewareResponse).toBeUndefined();

    const cspHeaders = response.headers.get("Content-Security-Policy");
    const cspHeadersSplit = cspHeaders?.split(";");

    const connectSrc = cspHeadersSplit?.find((csp) =>
      csp.includes("connect-src"),
    );
    expect(connectSrc).toBeDefined();
    expect(connectSrc).toContain("*");
  });
});
