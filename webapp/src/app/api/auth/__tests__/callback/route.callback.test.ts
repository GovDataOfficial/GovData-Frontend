import { beforeAll, describe, expect, test, vi } from "vitest";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server.js";
import * as client from "openid-client";

import { PAGES_AUTH } from "@/app/_lib/URLHelper.js";
import { getKeyCloakClient, KeycloakConfig } from "@/app/api/auth/_keycloak";
import { getCodeVerifierSession, setSession } from "@/app/api/auth/_session";

vi.mock("ioredis");
vi.mock("openid-client");
vi.mock("next/navigation");
vi.mock("@/app/api/auth/_session");
vi.mock("@/app/api/auth/_keycloak");

describe("auth / callback", () => {
  const keyCloakConfigMock = {} as unknown as KeycloakConfig;
  const mockTokenSet = { claims: vi.fn() } as any;

  beforeAll(async () => {
    vi.stubEnv("keycloak_client_id", "clientId");
    vi.stubEnv("keycloak_redirect_base_url", "http://www.testcloak.de");
    vi.stubEnv("session_secret", "12345678901234567890123456789012");
    vi.mocked(getKeyCloakClient).mockResolvedValue(keyCloakConfigMock);
    vi.mocked(client.authorizationCodeGrant).mockResolvedValue(mockTokenSet);
  });

  test("callback should return error if no code verifier session", async () => {
    vi.mocked(redirect).mockReset();
    vi.mocked(getCodeVerifierSession).mockResolvedValue(null);

    const request = new NextRequest("https://www.foo.de");
    const { GET } = await import("../../callback/route.js");

    await GET(request);

    expect(redirect).toHaveBeenCalledWith("/error");
  });

  test("callback should return redirect response and call setSession", async () => {
    vi.mocked(redirect).mockReset();
    const mockCodeVerifierSession = {
      codeVerifier: "123",
      state: "stateTest",
      redirectUri: "http://www.testcloak.de/api/auth/callback",
      destroy: vi.fn(),
    };

    vi.mocked(getCodeVerifierSession).mockResolvedValue(
      mockCodeVerifierSession as any,
    );

    const request = new NextRequest("https://www.foo.de");
    const { GET } = await import("../../callback/route.js");
    await GET(request);

    expect(mockCodeVerifierSession.destroy).toHaveBeenCalled();
    expect(setSession).toHaveBeenCalledWith(mockTokenSet);

    expect(redirect).toHaveBeenCalledWith(PAGES_AUTH.manage_metadata);
  });

  test("callback should call redirect url from session", async () => {
    vi.mocked(redirect).mockReset();
    const mockCodeVerifierSession = {
      codeVerifier: "123",
      state: "stateTest",
      redirectUri: "http://www.testcloak.de/api/auth/callback",
      redirectTo: "/bar",
      destroy: vi.fn(),
    };

    vi.mocked(getCodeVerifierSession).mockResolvedValue(
      mockCodeVerifierSession as any,
    );

    const request = new NextRequest("https://www.foo.de");
    const { GET } = await import("../../callback/route.js");
    await GET(request);

    expect(mockCodeVerifierSession.destroy).toHaveBeenCalled();
    expect(setSession).toHaveBeenCalledWith(mockTokenSet);

    expect(redirect).toHaveBeenCalledWith("/bar");
  });
});
