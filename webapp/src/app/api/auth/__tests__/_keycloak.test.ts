import { beforeAll, describe, expect, test, vi } from "vitest";
import { redirect } from "next/navigation";
import { Issuer } from "openid-client";

import { getCallbackUriFromRequest, getKeyCloakClient } from "../_keycloak";

vi.mock("openid-client");
vi.mock("next/navigation");

describe("_keycloak", () => {
  beforeAll(() => {
    vi.stubEnv("keycloak_issuer", "http://www.testcloak.de");
    vi.stubEnv("keycloak_redirect_base_url", "http://localhost:3000");
    vi.stubEnv("keycloak_client_id", "test-client-id");
    vi.stubEnv("keycloak_client_secret", "test-client-secret");
    vi.resetAllMocks();
  });

  test("should get the keycloak client", async () => {
    const mockIssuer = {
      Client: vi.fn().mockImplementation(() => ({
        redirect_uris: ["http://localhost:3000/api/auth/callback"],
      })),
    } as any;

    vi.mocked(Issuer.discover).mockResolvedValue(mockIssuer);

    const client = await getKeyCloakClient();

    expect(Issuer.discover).toHaveBeenCalledWith("http://www.testcloak.de");
    expect(client).toBeDefined();
    expect(client.redirect_uris).toContain(
      "http://localhost:3000/api/auth/callback",
    );
  });

  test("should handle invalid client configuration", async () => {
    const mockIssuer = {
      Client: vi.fn().mockImplementation(() => {
        throw new Error();
      }),
    } as any;

    vi.mocked(Issuer.discover).mockResolvedValue(mockIssuer);

    await getKeyCloakClient();
    expect(redirect).toHaveBeenCalledWith("/");
  });

  test("should generate correct callback URI from request", () => {
    const mockRequest = {
      headers: new Map([
        ["x-forwarded-host", "example.com"],
        ["x-forwarded-proto", "https"],
      ]),
      nextUrl: {
        searchParams: new URLSearchParams({
          redirectTo: "/datenpflege/anwendungen",
        }),
        origin: "http://localhost:3000",
      },
    } as any;

    const callbackUri = getCallbackUriFromRequest(mockRequest);

    expect(callbackUri).toBe(
      `https://example.com/api/auth/callback?redirectTo=${encodeURIComponent("/datenpflege/anwendungen")}`,
    );
  });
  test("should generate correct callback URI from request if redirectTo is empty", () => {
    const mockRequest = {
      headers: new Map([
        ["x-forwarded-host", "example.com"],
        ["x-forwarded-proto", "https"],
      ]),
      nextUrl: {
        searchParams: new URLSearchParams(),
        origin: "http://localhost:3000",
      },
    } as any;

    const callbackUri = getCallbackUriFromRequest(mockRequest);

    expect(callbackUri).toBe("https://example.com/api/auth/callback");
  });

  test("should fallback to request origin if headers are missing", () => {
    const mockRequest = {
      headers: new Map(),
      nextUrl: {
        searchParams: new URLSearchParams({
          redirectTo: "/datenpflege/anwendungen",
        }),
        origin: "http://localhost:3000",
      },
    } as any;

    const callbackUri = getCallbackUriFromRequest(mockRequest);

    expect(callbackUri).toBe(
      `http://localhost:3000/api/auth/callback?redirectTo=${encodeURIComponent("/datenpflege/anwendungen")}`,
    );
  });
});
