// @vitest-environment node

import { beforeEach, describe, expect, test, vi } from "vitest";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import * as client from "openid-client";

import { getKeyCloakClient } from "@/app/api/auth/_keycloak";
import { getRedisClient } from "@/app/api/auth/_redis";

vi.mock("next/headers");
vi.mock("next/navigation");
vi.mock("ioredis");
vi.mock("openid-client");
vi.mock("@/app/api/auth/_redis");
vi.mock("@/app/api/auth/_keycloak");

describe("_session", () => {
  const mockIdToken = "eyidtoken";
  const redisClientMock = {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  } as any;
  const mockToken = {
    id_token: mockIdToken,
    claims: () => ({ preferred_username: "test" }),
    expires_in: 555,
    refresh_expires_in: 777,
    expires_at: 0,
  } as any;

  function setupMockCookies(cookieName: string, cookieValue: string) {
    const mockCookies = new RequestCookies(new Headers());
    mockCookies.set(cookieName, cookieValue);
    vi.mocked(cookies).mockResolvedValue(
      mockCookies as unknown as Awaited<ReturnType<typeof cookies>>,
    );
    return mockCookies;
  }

  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("session_secret", "12345678901234567890123456789012");
    vi.mocked(getRedisClient).mockReturnValue(redisClientMock);
    vi.mocked(client.randomState).mockReturnValue("mockSessionId");
  });

  test("getSession should return null if no session cookie available", async () => {
    setupMockCookies("not_gd", "123");
    const { getSession } = await import("../_session.js");

    const session = await getSession();
    expect(session).toBeNull();
  });

  test("getSession should return null if session cant be found in redis", async () => {
    setupMockCookies("gd_session", "123");
    vi.mocked(redisClientMock.get).mockResolvedValue(null);
    const { getSession } = await import("../_session.js");

    const session = await getSession();
    expect(session).toBeNull();
  });

  test("getSession should return session if cookie value is found in redis", async () => {
    setupMockCookies("gd_session", "123");
    vi.mocked(redisClientMock.get).mockResolvedValue(JSON.stringify(mockToken));

    const { getSession } = await import("../_session.js");

    const session = await getSession();
    expect(session?.id_token).toBe(mockIdToken);
  });

  test("setSession should call the redis set method with given token", async () => {
    const mockCookies = setupMockCookies("", "");
    const { setSession } = await import("../_session.js");
    const setMockCookieSpy = vi.spyOn(mockCookies, "set");

    await setSession(mockToken);
    expect(redisClientMock.set).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      "EX",
      // sometimes its 554, timing problem? mock system time?
      mockToken.refresh_expires_in,
    );
    // Check if the session cookie is set
    expect(setMockCookieSpy).toHaveBeenCalledWith(
      "gd_session",
      expect.anything(),
      expect.objectContaining({
        secure: true,
        httpOnly: true,
        maxAge: 36000,
      }),
    );
  });

  test("setSession should set a default for expiration if not provided in token", async () => {
    const mockCookies = setupMockCookies("", "");
    mockToken.refresh_expires_in = undefined;
    const setMockCookieSpy = vi.spyOn(mockCookies, "set");

    const { setSession } = await import("../_session.js");
    await setSession(mockToken);
    expect(redisClientMock.set).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      "EX",
      600,
    );
    expect(setMockCookieSpy).toHaveBeenCalledWith(
      "gd_session",
      expect.anything(),
      expect.objectContaining({
        secure: true,
        httpOnly: true,
        maxAge: 36000,
      }),
    );
  });

  test("getCodeVerifierSession should return null if cookie is not available", async () => {
    const { getCodeVerifierSession } = await import("../_session.js");
    const codeVerifierSession = await getCodeVerifierSession();
    expect(codeVerifierSession).toBeNull();
  });

  test("getCodeVerifierSession should return session if available", async () => {
    setupMockCookies("gd_cvf", "123");
    const { getCodeVerifierSession } = await import("../_session.js");

    const session = await getCodeVerifierSession();
    expect(session).not.toBeNull();
  });

  test("hasSession should be true if the gd_session cookie is available", async () => {
    setupMockCookies("gd_session", "123");

    const { hasSessionCookie } = await import("../_session.js");

    const hasSession = await hasSessionCookie();
    expect(hasSession).toBe(true);
  });

  test("hasSession should be false if session gd_session is not set", async () => {
    setupMockCookies("not_gd", "123");
    const { hasSessionCookie } = await import("../_session.js");

    const hasSession = await hasSessionCookie();
    expect(hasSession).toBe(false);
  });

  test("deleteSession delete the redis session and the session cookie", async () => {
    const mockCookies = setupMockCookies("gd_session", "123123");
    const delMockCookiesSpy = vi.spyOn(mockCookies, "delete");

    const { deleteSession } = await import("../_session.js");

    await deleteSession();
    expect(redisClientMock.del).toHaveBeenCalledWith("123123");
    expect(delMockCookiesSpy).toHaveBeenCalledWith("gd_session");
  });

  test("setSession should correctly set session information including username and roles", async () => {
    const mockTokenWithRoles = {
      ...mockToken,
      access_token: "mockAccessToken",
      claims: () => ({
        preferred_username: "testUser",
        realm_access: {
          roles: ["showcases"],
        },
        iat: 1234567890,
      }),
    };

    vi.mocked(redisClientMock.set).mockResolvedValue(undefined);

    const { setSession } = await import("../_session.js");
    await setSession(mockTokenWithRoles);

    expect(redisClientMock.set).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining(
        JSON.stringify({
          username: "testUser",
          id_token: mockIdToken,
          access_token: mockTokenWithRoles.access_token,
          refresh_token: "",
          iat: 1234567890,
          roles: ["showcases"],
          expires_at: 0,
        }),
      ),
      "EX",
      600,
    );
  });

  test("getUserInformation should return null if no session cookie is available", async () => {
    setupMockCookies("not_gd", "123");
    const { getUserInformation } = await import("../_session.js");

    const userInfo = await getUserInformation();
    expect(userInfo).toBeNull();
  });

  test("getUserInformation should return null if session cannot be found in Redis", async () => {
    setupMockCookies("gd_session", "123");
    vi.mocked(redisClientMock.get).mockResolvedValue(null);
    const { getUserInformation } = await import("../_session.js");

    const userInfo = await getUserInformation();
    expect(userInfo).toBeNull();
  });

  test("getUserInformation should return user information if session exists in Redis", async () => {
    setupMockCookies("gd_session", "123");
    const mockSession = {
      username: "testUser",
      roles: ["showcases"],
    };
    vi.mocked(redisClientMock.get).mockResolvedValue(
      JSON.stringify(mockSession),
    );

    const { getUserInformation } = await import("../_session.js");

    const userInfo = await getUserInformation();
    expect(userInfo).toEqual({
      username: "testUser",
      isShowcaseEditor: true,
    });
  });

  test("getUserInformation should correctly handle roles and return isShowcaseEditor as false if roles do not include 'showcases'", async () => {
    setupMockCookies("gd_session", "123");
    const mockSession = {
      username: "testUser",
      roles: ["otherRole"],
    };
    vi.mocked(redisClientMock.get).mockResolvedValue(
      JSON.stringify(mockSession),
    );

    const { getUserInformation } = await import("../_session.js");

    const userInfo = await getUserInformation();
    expect(userInfo).toEqual({
      username: "testUser",
      isShowcaseEditor: false,
    });
  });

  test("getSessionAndRefreshIt should return session if session exists and is not expired", async () => {
    setupMockCookies("gd_session", "123");
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const mockSession = {
      username: "testUser",
      id_token: mockIdToken,
      access_token: "mockAccessToken",
      refresh_token: "mockRefreshToken",
      iat: currentTimeInSeconds - 100,
      roles: ["showcases"],
      expires_at: currentTimeInSeconds + 300, // expires in 5 minutes
    };
    vi.mocked(redisClientMock.get).mockResolvedValue(
      JSON.stringify(mockSession),
    );

    const { getSessionAndRefreshIt: getSessionAndRefreshIt } =
      await import("../_session.js");

    const session = await getSessionAndRefreshIt();
    expect(session).toEqual(mockSession);
    expect(redisClientMock.get).toHaveBeenCalledWith("123");
  });

  test("getSessionAndRefreshIt should refresh token and return new session if token is expired", async () => {
    setupMockCookies("gd_session", "123");
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const expiredSession = {
      username: "testUser",
      id_token: mockIdToken,
      access_token: "expiredAccessToken",
      refresh_token: "mockRefreshToken",
      iat: currentTimeInSeconds - 1000,
      roles: ["showcases"],
      expires_at: currentTimeInSeconds - 10, // expired 10 seconds ago
    };

    const refreshedToken = {
      ...mockToken,
      access_token: "newAccessToken",
      refresh_token: "newRefreshToken",
      expires_at: currentTimeInSeconds + 500,
      refresh_expires_in: 600,
      claims: () => ({
        preferred_username: "testUser",
        realm_access: { roles: ["showcases"] },
        iat: currentTimeInSeconds,
      }),
    };

    // Mock getKeyCloakClient to return config
    const mockKeyCloakConfig = {} as any;
    vi.mocked(getKeyCloakClient).mockResolvedValue(mockKeyCloakConfig);

    // Mock client.refreshTokenGrant
    vi.mocked(client.refreshTokenGrant).mockResolvedValue(refreshedToken);

    vi.mocked(redisClientMock.get).mockResolvedValue(
      JSON.stringify(expiredSession),
    );
    vi.mocked(redisClientMock.set).mockResolvedValue(undefined);

    const { getSessionAndRefreshIt: getSessionAndRefreshIt } =
      await import("../_session.js");

    const session = await getSessionAndRefreshIt();

    expect(client.refreshTokenGrant).toHaveBeenCalledWith(
      mockKeyCloakConfig,
      "mockRefreshToken",
    );
    expect(redisClientMock.set).toHaveBeenCalledWith(
      "123",
      expect.stringContaining("newAccessToken"),
      "EX",
      600,
    );
    expect(session?.access_token).toBe("newAccessToken");
    expect(session?.username).toBe("testUser");
  });
});
