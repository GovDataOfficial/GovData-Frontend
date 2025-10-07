import { beforeEach, describe, expect, test, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import {
  getSessionAndRefreshIt,
  SessionInformation,
} from "@/app/api/auth/_session";
import { withAuthentication } from "@/middlewares/withAuthentication";

vi.mock("@/app/api/auth/_session");

describe("middleware with Authentication", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  async function callAuthMiddlewareWith(url: string) {
    const request = new NextRequest(new URL(url));
    const response = new NextResponse();
    return await withAuthentication(request, response);
  }

  test("no manage data route - should return undefined", async () => {
    const middlewareResponse = await callAuthMiddlewareWith(
      "https://test.de/api/intern",
    );
    expect(middlewareResponse).toBeUndefined();
  });

  test("manage data route and valid session - should return undefined", async () => {
    vi.mocked(getSessionAndRefreshIt).mockResolvedValueOnce(
      {} as SessionInformation,
    );
    const middlewareResponse = await callAuthMiddlewareWith(
      `https://test.de${PAGES_AUTH.manage_data}`,
    );
    expect(middlewareResponse).toBeUndefined();
  });

  test("manage data subroute and valid session - should return undefined", async () => {
    vi.mocked(getSessionAndRefreshIt).mockResolvedValueOnce(
      {} as SessionInformation,
    );
    const middlewareResponse = await callAuthMiddlewareWith(
      `https://test.de${PAGES_AUTH.manage_data}/subroute`,
    );

    expect(middlewareResponse).toBeUndefined();
  });

  test("manage data route and invalid session - should redirect to login", async () => {
    vi.mocked(getSessionAndRefreshIt).mockResolvedValueOnce(null);
    const middlewareResponse = await callAuthMiddlewareWith(
      `https://test.de${PAGES_AUTH.manage_data}`,
    );

    expect(middlewareResponse).toBeInstanceOf(Function);
    const result = middlewareResponse!();

    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(307); // NextResponse.redirect creates a 307 redirect
    expect(result.headers.get("location")).toContain(API_ENDPOINTS.AUTH.LOGIN);
  });
});
