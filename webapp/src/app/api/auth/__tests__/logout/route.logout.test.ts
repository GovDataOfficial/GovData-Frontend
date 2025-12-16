import { describe, expect, test, vi } from "vitest";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server.js";
import * as client from "openid-client";

import { checkFeatureFlagForDataManagement } from "@/app/api/_lib/checkFeatureFlags.js";
import { getKeyCloakClient, KeycloakConfig } from "@/app/api/auth/_keycloak";
import { deleteSession, getSession } from "@/app/api/auth/_session";

vi.mock("ioredis");
vi.mock("next/headers");
vi.mock("next/navigation");
vi.mock("openid-client");
vi.mock("@/app/api/auth/_keycloak");
vi.mock("@/app/api/auth/_session");
vi.mock("@/app/api/_lib/checkFeatureFlags");

describe("auth / logout", () => {
  const endSessionUrl = new URL("http://killsession/");
  const keyCloakConfigMock = {} as unknown as KeycloakConfig;

  const mockSession = {
    username: "test",
    id_token: "testtoken",
    iat: 0,
    access_token: "0",
    refresh_token: "0",
    roles: [],
    expires_at: 0,
  };

  vi.mocked(checkFeatureFlagForDataManagement).mockReturnValue(true);

  test("should return a redirect response and call buildEndSessionUrl", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(getKeyCloakClient).mockResolvedValue(keyCloakConfigMock);
    vi.mocked(client.buildEndSessionUrl).mockReturnValue(endSessionUrl);
    const { GET } = await import("../../logout/route.js");
    await GET(new NextRequest("https://www.foo.de"));

    expect(client.buildEndSessionUrl).toHaveBeenCalledWith(
      keyCloakConfigMock,
      expect.objectContaining({
        id_token_hint: mockSession.id_token,
      }),
    );
    expect(deleteSession).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith(endSessionUrl.href);
  });

  test("should return 501 if feature is not enabled", async () => {
    vi.mocked(checkFeatureFlagForDataManagement).mockReturnValue(false);
    const { GET } = await import("../../logout/route.js");
    const response = await GET(new NextRequest("https://www.foo.de"));
    expect(response?.status).toBe(501);
  });
});
