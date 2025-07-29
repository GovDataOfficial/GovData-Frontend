"server-only";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generators, IdTokenClaims, TokenSet } from "openid-client";

import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import { getKeyCloakClient } from "@/app/api/auth/_keycloak";
import { getRedisClient } from "@/app/api/auth/_redis";
import { logger } from "@/logger/logger";

const password = process.env.session_secret;
const SESSION_COOKIE = "gd_session";
const CODE_VERIFIER_COOKIE = "gd_cvf";
const SHOWCASES_EDITOR_ROLE = "showcases";
const refreshBufferSeconds = 5;

const log = logger("_session.ts");

type KeycloakToken = TokenSet & {
  refresh_expires_in?: number;
};

type RealmAccess = {
  roles: string[];
};

type TokenClaims = IdTokenClaims & {
  realm_access?: RealmAccess;
};

export type SessionInformation = {
  username: string;
  id_token: string;
  access_token: string;
  refresh_token: string;
  iat: number;
  expires_at: number;
  roles: string[];
};

type UserInformation = {
  username: string;
  isShowcaseEditor: boolean;
};

/**
 * Initializes an Iron Session for storing the code verifier.
 */
async function getCodeVerifierIronSession() {
  const cookieStore = await cookies();
  return getIronSession<{ value: string }>(cookieStore, {
    password: password!,
    cookieName: CODE_VERIFIER_COOKIE,
  });
}

async function getSessionIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  return sessionCookie ? sessionCookie.value : null;
}

/**
 * Retrieves a session from Redis using a session cookie.
 */
async function getRedisSession(id: string): Promise<SessionInformation | null> {
  try {
    const redisClient = getRedisClient();
    if (redisClient) {
      const session = await redisClient.get(id);
      return session ? JSON.parse(session) : null;
    }
    return null;
  } catch (error) {
    log.error(error, "Failed to get session from Redis:");
    return null;
  }
}

export async function getSession(): Promise<SessionInformation | null> {
  const sessionId = await getSessionIdFromCookie();

  if (sessionId) {
    return getRedisSession(sessionId);
  }

  return null;
}

/**
 * Retrieves user from a session or null if non is existent.
 * this will not refresh the session.
 */
export async function getUserInformation(): Promise<UserInformation | null> {
  const sessionId = await getSessionIdFromCookie();

  if (sessionId) {
    const session = await getRedisSession(sessionId);
    if (session) {
      return {
        username: session.username,
        isShowcaseEditor: session.roles.includes(SHOWCASES_EDITOR_ROLE),
      };
    }
  }
  return null;
}

/**
 * Retrieves a session from Redis using id in session cookie.
 * If no session exists, the user is redirected to the login page.
 * This will also refresh the session if it is older than 5 minutes.
 */
export async function getSessionOrRedirect(
  requestUrl?: string,
): Promise<SessionInformation> {
  const sessionId = await getSessionIdFromCookie();
  let loginUrl = API_ENDPOINTS.AUTH.LOGIN;
  if (requestUrl) {
    loginUrl = `${loginUrl}?redirectTo=${encodeURIComponent(requestUrl)}`;
  }

  if (!sessionId) {
    redirect(loginUrl);
  }

  const session = await getRedisSession(sessionId);

  if (!session) {
    redirect(loginUrl);
  }

  // refresh token if it is older than the refresh time minus 5 seconds as buffer
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);

  if (currentTimeInSeconds > session.expires_at - refreshBufferSeconds) {
    try {
      const client = await getKeyCloakClient();
      const newTokenSet = await client.refresh(session.refresh_token);
      const newSession = await setSession(newTokenSet, sessionId);
      return newSession;
    } catch (error) {
      log.error(error, "Failed to refresh token");
      redirect(loginUrl);
    }
  }

  return session;
}

/**
 * Sets a session in Redis with an expiration time and stores the session ID in a cookie.
 * @param {TokenSet} token - The token set to be stored in the session.
 * @param currentSessionId - if set, the session with this id will be updated without recreating the cookie.
 */
export async function setSession(
  token: KeycloakToken,
  currentSessionId?: string,
) {
  const sessionId = currentSessionId || generators.random(128);
  const expiration = token.refresh_expires_in || 600;
  const claims = token.claims() as TokenClaims;
  let roles: string[] = [];

  const session: SessionInformation = {
    username: claims.preferred_username || "",
    id_token: token.id_token || "",
    access_token: token.access_token || "",
    refresh_token: token.refresh_token || "",
    iat: claims.iat || 0,
    roles: claims.realm_access?.roles || roles,
    expires_at: token.expires_at || 0,
  };
  const redisSessionString = JSON.stringify(session);

  try {
    log.debug("Try to refresh Session:");
    const redisClient = getRedisClient();
    await redisClient?.set(sessionId, redisSessionString, "EX", expiration);
    // if currentSessionId is provided we update an existing session
    if (!currentSessionId) {
      (await cookies()).set(SESSION_COOKIE, sessionId, {
        secure: true,
        httpOnly: true,
        // can not update cookies on pageload with redis info
        // as nextjs middleware not allowing nodejs.
        // in future this cookie should also get a new value when refreshing token
        // set it to a sane default time for now
        maxAge: 36000,
      });
    }
  } catch (error) {
    log.error(error, "Failed to set session in Redis:");
  }
  return session;
}

/**
 * Deletes a session from Redis and removes the session cookie.
 */
export async function deleteSession() {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE);
  if (!sessionCookie) {
    return;
  }
  try {
    const redisClient = getRedisClient();
    await redisClient?.del(sessionCookie.value);
  } catch (error) {
    log.error(error, "Failed to delete session from Redis:");
  }
  // delete cookie anyway!
  (await cookies()).delete(SESSION_COOKIE);
}

/**
 * Checks if a session cookie exists. This does not check if the session is valid.
 * @returns {boolean} True if the session cookie exists, false otherwise.
 */
export async function hasSessionCookie(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(SESSION_COOKIE);
}

/**
 * Retrieves the code verifier session if the corresponding cookie exists.
 */
export async function getCodeVerifierSession() {
  const cookieStore = await cookies();
  if (!cookieStore || !cookieStore.has(CODE_VERIFIER_COOKIE)) {
    return null;
  }

  return getCodeVerifierIronSession();
}

/**
 * Sets the code verifier session.
 * @param {string} codeVerifier - The code verifier to be stored in the session.
 */
export async function setCodeVerifierSession(codeVerifier: string) {
  const session = await getCodeVerifierIronSession();
  session.value = codeVerifier;
  await session.save();
}
