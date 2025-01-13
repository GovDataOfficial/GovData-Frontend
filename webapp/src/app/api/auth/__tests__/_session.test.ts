// @vitest-environment node

import { beforeAll, describe, expect, test, vi } from "vitest";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

import { getRedisClient } from "@/app/api/auth/_redis";

vi.mock("next/headers");
vi.mock("ioredis");
vi.mock("@/app/api/auth/_redis");

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
  } as any;

  function setupMockCookies(cookieName: string, cookieValue: string) {
    const mockCookies = new RequestCookies(new Headers());
    mockCookies.set(cookieName, cookieValue);
    vi.mocked(cookies).mockReturnValue(
      mockCookies as unknown as ReturnType<typeof cookies>,
    );
    return mockCookies;
  }

  beforeAll(() => {
    vi.resetAllMocks();
    vi.stubEnv("session_secret", "12345678901234567890123456789012");
    vi.mocked(getRedisClient).mockReturnValue(redisClientMock);
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

    const hasSession = hasSessionCookie();
    expect(hasSession).toBe(true);
  });

  test("hasSession should be false if session gd_session is not set", async () => {
    setupMockCookies("not_gd", "123");
    const { hasSessionCookie } = await import("../_session.js");

    const hasSession = hasSessionCookie();
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
});
