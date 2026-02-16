import { beforeAll, describe, expect, test, vi } from "vitest";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server.js";
import * as client from "openid-client";

import { checkFeatureFlagForEnvVarDataManagement } from "@/app/api/_lib/checkEnvVarFeatureFlags.js";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints.js";
import {
  getCallbackUriFromRequest,
  getKeyCloakClient,
  KeycloakConfig,
} from "@/app/api/auth/_keycloak";
import { setCodeVerifierSession } from "@/app/api/auth/_session";

vi.mock("ioredis");
vi.mock("openid-client");
vi.mock("next/navigation");
vi.mock("@/app/api/auth/_session");
vi.mock("@/app/api/auth/_keycloak");
vi.mock("@/app/api/_lib/checkEnvVarFeatureFlags");

describe("auth / login", () => {
  const authUrl = new URL("http://foo/auth");
  const keyCloakConfigMock = {} as unknown as KeycloakConfig;

  beforeAll(() => {
    vi.stubEnv("keycloak_client_id", "http://www.testcloak.de");
    vi.stubEnv("session_secret", "12345678901234567890123456789012");
    vi.stubEnv("keycloak_redirect_base_url", "http://www.testcloak.de");
    vi.mocked(getKeyCloakClient).mockResolvedValue(keyCloakConfigMock);
    vi.mocked(client.randomPKCECodeVerifier).mockReturnValue(
      "codeVerifierTest",
    );
    vi.mocked(client.randomState).mockReturnValue("stateTest");
    vi.mocked(client.calculatePKCECodeChallenge).mockResolvedValue(
      "codeChallengeTest",
    );
    vi.mocked(client.buildAuthorizationUrl).mockReturnValue(authUrl);
    vi.mocked(checkFeatureFlagForEnvVarDataManagement).mockReturnValue(true);
  });

  test("should return a redirect response", async () => {
    const redirectTo = "/bar";
    const redirect_uri = `http://www.testcloak.de/${API_ENDPOINTS.AUTH.CALLBACK}`;
    const { GET } = await import("../../login/route.js");
    vi.mocked(getCallbackUriFromRequest).mockReturnValue(redirect_uri);
    await GET(
      new NextRequest(
        `https://www.foo.de?redirectTo=${encodeURIComponent(redirectTo)}`,
      ),
    );

    // checking that cookie has been set with code verifier, state, redirect_uri, and redirectTo
    expect(setCodeVerifierSession).toHaveBeenCalledWith(
      "codeVerifierTest",
      "stateTest",
      redirect_uri,
      redirectTo,
    );
    expect(client.buildAuthorizationUrl).toHaveBeenCalledWith(
      keyCloakConfigMock,
      {
        scope: "openid",
        code_challenge_method: "S256",
        code_challenge: "codeChallengeTest",
        redirect_uri,
        state: "stateTest",
      },
    );
    expect(client.calculatePKCECodeChallenge).toHaveBeenCalledWith(
      "codeVerifierTest",
    );

    expect(redirect).toHaveBeenCalledWith(authUrl.href);
  });

  test("should return 501 if feature is not enabled", async () => {
    vi.mocked(checkFeatureFlagForEnvVarDataManagement).mockReturnValue(false);
    const { GET } = await import("../../login/route.js");
    const response = await GET(
      new NextRequest(`https://www.foo.de?redirectTo=$redirectTo`),
    );
    expect(response?.status).toBe(501);
  });
});
