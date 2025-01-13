import { beforeAll, describe, expect, test, vi } from "vitest";
import { redirect } from "next/navigation";
import { Issuer } from "openid-client";

import { getKeyCloakClient } from "../_keycloak";

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
});
