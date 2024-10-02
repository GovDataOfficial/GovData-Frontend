// @vitest-environment node

import { beforeEach, describe, expect, test, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { withAuthMiddleware } from "@/middlewares/withAuthMiddleware";

vi.spyOn(NextResponse, "redirect");

describe("middleware Redirect", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("should redirect internal urls as form is not active", () => {
    vi.stubEnv("metadataform_active", "");

    const url = new URL("https://test.de/datenpflege");
    const request = new NextRequest(url);
    const response = new NextResponse();
    const middlewareResponse = withAuthMiddleware(request, response);

    expect(middlewareResponse).toBeTypeOf("function");
    middlewareResponse!();
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("https://test.de/"),
    );
  });

  test("should redirect internal urls for nested url call", () => {
    vi.stubEnv("metadataform_active", "");

    const url = new URL("https://test.de/datenpflege/metadata/foo");
    const request = new NextRequest(url);
    const response = new NextResponse();
    const middlewareResponse = withAuthMiddleware(request, response);

    expect(middlewareResponse).toBeTypeOf("function");
    middlewareResponse!();
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("https://test.de/"),
    );
  });

  test("should redirect api calls if its not active", () => {
    vi.stubEnv("metadataform_active", "");

    const url = new URL("https://test.de/api/datenpflege");
    const request = new NextRequest(url);
    const response = new NextResponse();
    const middlewareResponse = withAuthMiddleware(request, response);

    expect(middlewareResponse).toBeTypeOf("function");
    middlewareResponse!();
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("https://test.de/"),
    );
  });

  test("should not redirect if is active", () => {
    vi.stubEnv("metadataform_active", "1");

    const url = new URL("https://test.de/api/intern");
    const request = new NextRequest(url);
    const response = new NextResponse();
    const middlewareResponse = withAuthMiddleware(request, response);

    expect(middlewareResponse).toBeUndefined();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  test("should not redirect nested if is active", () => {
    vi.stubEnv("metadataform_active", "1");

    const url = new URL("https://test.de/datenpflege/foo/metadaten");
    const request = new NextRequest(url);
    const response = new NextResponse();
    const middlewareResponse = withAuthMiddleware(request, response);

    expect(middlewareResponse).toBeUndefined();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });
});
