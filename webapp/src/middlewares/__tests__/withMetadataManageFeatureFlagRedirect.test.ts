import { beforeEach, describe, expect, test, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

import { isFeatureEnabled } from "@/app/_lib/features";
import { withDataManageFeatureFlagRedirect } from "@/middlewares/withMetadataManageFeatureFlagRedirect";

vi.mock("@/app/api/auth/_session");
vi.mock("next/navigation");
vi.mock("@/app/_lib/features");

describe("middleware Redirect", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  async function callAuthMiddlewareWith(url: string) {
    const request = new NextRequest(new URL(url));
    const response = new NextResponse();
    return await withDataManageFeatureFlagRedirect(request, response);
  }

  test("form not active -  should return error response", async () => {
    vi.stubEnv("data_management_active", "");
    const middlewareResponse = await callAuthMiddlewareWith(
      "https://test.de/datenpflege",
    );

    expect(middlewareResponse).toBeInstanceOf(Function);
    const result = middlewareResponse!();

    expect(result).toBeInstanceOf(Response);
    expect(result.type).toBe("error");
  });

  test("form not active- should return error response nested route", async () => {
    vi.stubEnv("data_management_active", "");
    const middlewareResponse = await callAuthMiddlewareWith(
      "https://test.de/datenpflege/metadata/foo",
    );

    expect(middlewareResponse).toBeInstanceOf(Function);
    const result = middlewareResponse!();

    expect(result).toBeInstanceOf(Response);
    expect(result.type).toBe("error");
  });

  test("form active -should not return error responses", async () => {
    vi.stubEnv("data_management_active", "1");
    const middlewareResponse = await callAuthMiddlewareWith(
      "https://test.de/datenpflege",
    );
    expect(middlewareResponse).toBeUndefined();
  });

  test("form active - should not return error response on nested route", async () => {
    vi.stubEnv("data_management_active", "1");
    const middlewareResponse = await callAuthMiddlewareWith(
      "https://test.de/datenpflege/foo/metadaten",
    );
    expect(middlewareResponse).toBeUndefined();
  });

  test("other route - should not return error response", async () => {
    vi.stubEnv("data_management_active", "");
    const middlewareResponse = await callAuthMiddlewareWith(
      "https://test.de/other",
    );
    expect(middlewareResponse).toBeUndefined();
  });

  test("SPARQL feature disabled - should redirect to home", async () => {
    vi.stubEnv("data_management_active", "1");
    vi.mocked(isFeatureEnabled).mockReturnValue(false);
    const middlewareResponse = await callAuthMiddlewareWith(
      "https://test.de/sparql-assistent",
    );

    expect(middlewareResponse).toBeInstanceOf(Function);
    const result = middlewareResponse!();

    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(307);
    expect(result.headers.get("Location")).toBe("https://test.de/");
  });
});
