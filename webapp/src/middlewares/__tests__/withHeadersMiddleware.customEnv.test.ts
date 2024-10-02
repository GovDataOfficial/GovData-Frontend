// @vitest-environment node

import { beforeAll, describe, expect, test, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

vi.spyOn(NextResponse, "redirect");

// extra tests for custom envs as envs are evaluated when importing the file

describe("middleware Headers with custom env", () => {
  let withHeadersMiddleware: any = null;

  beforeAll(async () => {
    vi.stubEnv("csp_extra_script_src", `["'unsafe-eval'"]`);
    vi.stubEnv(
      "csp_extra_img_src",
      `["https://sgx.geodatenzentrum.de/", "https://test.net:8081/"]`,
    );

    const middleware = await import("../withHeadersMiddleware.js");
    withHeadersMiddleware = middleware.withHeadersMiddleware;
  });

  const url = new URL("https://test.de/");
  const request = new NextRequest(url);

  test("should add extra CSP headers on response", async () => {
    const response = new NextResponse();
    const middlewareResponse = withHeadersMiddleware(request, response);

    expect(middlewareResponse).toBeUndefined();

    const cspHeaders = response.headers.get("Content-Security-Policy");
    const cspHeadersSplit = cspHeaders?.split(";");

    const scriptSrc = cspHeadersSplit?.find((csp) =>
      csp.includes("script-src"),
    );
    expect(scriptSrc).toBeDefined();
    expect(scriptSrc).toContain("'self'");
    expect(scriptSrc).toContain("'unsafe-inline'");
    expect(scriptSrc).toContain("'unsafe-eval'");

    const imgSrc = cspHeadersSplit?.find((csp) => csp.includes("img-src"));
    expect(imgSrc).toBeDefined();
    expect(imgSrc).toContain("'self'");
    expect(imgSrc).toContain("data:");
    expect(imgSrc).toContain("https://sgx.geodatenzentrum.de/");
    expect(imgSrc).toContain("https://test.net:8081/");
  });
});
