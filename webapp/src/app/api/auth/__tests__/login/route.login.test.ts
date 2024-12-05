import { beforeAll, describe, expect, test, vi } from "vitest";
import { getKeyCloakClient, KeycloakClient } from "@/app/api/auth/_keycloak";
import { setCodeVerifierSession } from "@/app/api/auth/_session";
import { generators } from "openid-client";
import { redirect } from "next/navigation";

vi.mock("ioredis");
vi.mock("openid-client");
vi.mock("next/navigation");
vi.mock("@/app/api/auth/_session");
vi.mock("@/app/api/auth/_keycloak");

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
  });

  test("should return a redirect response", async () => {
    const { GET } = await import("../../login/route.js");
    await GET();

    // checking that cookie has been set with code challenge verifier
    expect(setCodeVerifierSession).toHaveBeenCalledWith("codeVerifierTest");
    expect(keyCloakClientMock.authorizationUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: "openid",
        code_challenge_method: "S256",
        code_challenge: "codeChallengeTest",
      }),
    );
    expect(generators.codeChallenge).toHaveBeenCalledWith("codeVerifierTest");

    expect(redirect).toHaveBeenCalledWith(authUrl);
  });
});
