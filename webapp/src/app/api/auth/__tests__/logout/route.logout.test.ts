import { describe, expect, test, vi } from "vitest";
import { getKeyCloakClient, KeycloakClient } from "@/app/api/auth/_keycloak";
import { deleteSession, getSession } from "@/app/api/auth/_session";
import { redirect } from "next/navigation";

vi.mock("ioredis");
vi.mock("next/headers");
vi.mock("next/navigation");
vi.mock("@/app/api/auth/_keycloak");
vi.mock("@/app/api/auth/_session");

describe("auth / logout", () => {
  const endSessionUrl = "http://killsession/";
  const keyCloakClientMock = {
    endSessionUrl: vi.fn().mockReturnValue(endSessionUrl),
  } as unknown as KeycloakClient;

  const mockSession = {
    username: "test",
    id_token: "testtoken",
    iat: 0,
    refresh_token: "0",
  };

  test("should return a redirect response and call endsession on keycloak client", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession);
    vi.mocked(getKeyCloakClient).mockResolvedValue(keyCloakClientMock);
    const { GET } = await import("../../logout/route.js");
    await GET();

    expect(keyCloakClientMock.endSessionUrl).toHaveBeenCalledWith({
      id_token_hint: mockSession.id_token,
    });
    expect(deleteSession).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith(endSessionUrl);
  });
});
