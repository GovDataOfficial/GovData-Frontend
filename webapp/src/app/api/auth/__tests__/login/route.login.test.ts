import { beforeAll, describe, expect, test, vi } from "vitest";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server.js";
import { generators } from "openid-client";

import { checkFeatureFlagForDataManagement } from "@/app/api/_lib/checkFeatureFlags.js";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints.js";
import {
  getCallbackUriFromRequest,
  getKeyCloakClient,
  KeycloakClient,
} from "@/app/api/auth/_keycloak";
import { setCodeVerifierSession } from "@/app/api/auth/_session";
import { POST } from "@/app/api/datenpflege/showcases/edit/[id]/route.js";

vi.mock("ioredis");
vi.mock("openid-client");
vi.mock("next/navigation");
vi.mock("@/app/api/auth/_session");
vi.mock("@/app/api/auth/_keycloak");
vi.mock("@/app/api/_lib/checkFeatureFlags");

describe("auth / login", () => {
  const authUrl = "http://foo/auth";
  const keyCloakClientMock = {
    authorizationUrl: vi.fn().mockReturnValue(authUrl),
  } as unknown as KeycloakClient;

  beforeAll(() => {
    vi.stubEnv("keycloak_client_id", "http://www.testcloak.de");
    vi.stubEnv("session_secret", "12345678901234567890123456789012");
    vi.stubEnv("keycloak_redirect_base_url", "http://www.testcloak.de");
    vi.mocked(getKeyCloakClient).mockResolvedValue(keyCloakClientMock);
    vi.mocked(generators.codeVerifier).mockReturnValue("codeVerifierTest");
    vi.mocked(generators.codeChallenge).mockReturnValue("codeChallengeTest");
    vi.mocked(checkFeatureFlagForDataManagement).mockReturnValue(true);
  });

  test("should return a redirect response", async () => {
    const redirectTo = encodeURIComponent("/bar");
    const redirect_uri = `http://www.testcloak.de/${API_ENDPOINTS.AUTH.CALLBACK}?redirectTo=${redirectTo}`;
    const { GET } = await import("../../login/route.js");
    vi.mocked(getCallbackUriFromRequest).mockReturnValue(redirect_uri);
    await GET(new NextRequest(`https://www.foo.de?redirectTo=${redirectTo}`));

    // checking that cookie has been set with code challenge verifier
    expect(setCodeVerifierSession).toHaveBeenCalledWith("codeVerifierTest");
    expect(keyCloakClientMock.authorizationUrl).toHaveBeenCalledWith({
      scope: "openid",
      code_challenge_method: "S256",
      code_challenge: "codeChallengeTest",
      redirect_uri,
    });
    expect(generators.codeChallenge).toHaveBeenCalledWith("codeVerifierTest");

    expect(redirect).toHaveBeenCalledWith(authUrl);
  });

  test("should return 501 if feature is not enabled", async () => {
    vi.mocked(checkFeatureFlagForDataManagement).mockReturnValue(false);
    const { GET } = await import("../../login/route.js");
    const response = await GET(
      new NextRequest(`https://www.foo.de?redirectTo=$redirectTo`),
    );
    expect(response?.status).toBe(501);
  });
});
