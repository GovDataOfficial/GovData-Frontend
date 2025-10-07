import { beforeEach, describe, expect, test, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import {
  getSessionAndRefreshIt,
  getUserInformation,
  UserInformation,
} from "@/app/api/auth/_session";
import { withAuthorization } from "@/middlewares/withAuthorization";

vi.mock("@/app/api/auth/_session");

describe("middleware with Authorization", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  async function callAuthMiddlewareWith(url: string) {
    const request = new NextRequest(new URL(url));
    const response = new NextResponse();
    return await withAuthorization(request, response);
  }

  test("no manage showcase route - should return undefined", async () => {
    const middlewareResponse = await callAuthMiddlewareWith(
      "https://test.de/api/intern",
    );
    expect(middlewareResponse).toBeUndefined();
  });

  test("manage showcase route - should return undefined", async () => {
    vi.mocked(getUserInformation).mockResolvedValueOnce({
      isShowcaseEditor: true,
    } as UserInformation);
    const middlewareResponse = await callAuthMiddlewareWith(
      `https://test.de${PAGES_AUTH.manage_showcases}`,
    );
    expect(middlewareResponse).toBeUndefined();
  });

  test("manage showcase subroute and no user information - should return undefined", async () => {
    vi.mocked(getUserInformation).mockResolvedValueOnce(null);
    const middlewareResponse = await callAuthMiddlewareWith(
      `https://test.de${PAGES_AUTH.manage_showcases}/subroute`,
    );
    expect(middlewareResponse).toBeInstanceOf(Function);
    const result = middlewareResponse!();

    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(307); // NextResponse.redirect creates a 307 redirect
    expect(result.headers.get("location")).toContain(API_ENDPOINTS.AUTH.LOGIN);
  });

  test("manage showcase subroute and showcase editor - should return undefined", async () => {
    vi.mocked(getUserInformation).mockResolvedValueOnce({
      isShowcaseEditor: true,
    } as UserInformation);
    const middlewareResponse = await callAuthMiddlewareWith(
      `https://test.de${PAGES_AUTH.manage_showcases}/subroute`,
    );
    expect(middlewareResponse).toBeUndefined();
  });

  test("manage showcase subroute and not showcase editor - should return undefined", async () => {
    vi.mocked(getUserInformation).mockResolvedValueOnce({
      isShowcaseEditor: false,
    } as UserInformation);
    const middlewareResponse = await callAuthMiddlewareWith(
      `https://test.de${PAGES_AUTH.manage_showcases}/subroute`,
    );

    expect(middlewareResponse).toBeInstanceOf(Function);
    const result = middlewareResponse!();

    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(307); // NextResponse.redirect creates a 307 redirect
    expect(result.headers.get("location")).toEqual(
      `https://test.de${PAGES_AUTH.manage_showcases}`,
    );
  });
});
