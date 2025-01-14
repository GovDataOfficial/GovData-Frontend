// @vitest-environment node
import { beforeEach, describe, expect, test, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

import { withMetaDataManageFeatureFlagRedirect } from "@/middlewares/withMetadataManageFeatureFlagRedirect";

vi.mock("@/app/api/auth/_session");
vi.mock("next/navigation");

describe("middleware Redirect", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  async function callAuthMiddlewareWith(url: string) {
    const request = new NextRequest(new URL(url));
    const response = new NextResponse();
    return await withMetaDataManageFeatureFlagRedirect(request, response);
  }

  test("form not active -  should return error response", async () => {
    vi.stubEnv("metadata_management_active", "");
    const middlewareResponse = await callAuthMiddlewareWith(
      "https://test.de/datenpflege",
    );

    expect(middlewareResponse).toBeInstanceOf(Function);
    const result = middlewareResponse!();

    expect(result).toBeInstanceOf(Response);
    expect(result.type).toBe("error");
  });

  test("form not active- should return error response nested route", async () => {
    vi.stubEnv("metadata_management_active", "");
    const middlewareResponse = await callAuthMiddlewareWith(
      "https://test.de/datenpflege/metadata/foo",
    );

    expect(middlewareResponse).toBeInstanceOf(Function);
    const result = middlewareResponse!();

    expect(result).toBeInstanceOf(Response);
    expect(result.type).toBe("error");
  });

  test("form not active - should return error response on api/auth route", async () => {
    vi.stubEnv("metadata_management_active", "");
    const middlewareResponse = await callAuthMiddlewareWith(
      "https://test.de/api/auth",
    );

    expect(middlewareResponse).toBeInstanceOf(Function);
    const result = middlewareResponse!();

    expect(result).toBeInstanceOf(Response);
    expect(result.type).toBe("error");
  });

  test("form active -should not return error responses", async () => {
    vi.stubEnv("metadata_management_active", "1");
    const middlewareResponse = await callAuthMiddlewareWith(
      "https://test.de/api/intern",
    );
    expect(middlewareResponse).toBeUndefined();
  });

  test("form active - should not return error response on nested route", async () => {
    vi.stubEnv("metadata_management_active", "1");
    const middlewareResponse = await callAuthMiddlewareWith(
      "https://test.de/datenpflege/foo/metadaten",
    );
    expect(middlewareResponse).toBeUndefined();
  });
});
