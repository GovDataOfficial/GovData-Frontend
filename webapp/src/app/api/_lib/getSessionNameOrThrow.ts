"server-only";

import { delayBetween } from "@/app/_lib/debounce";
import {
  getSessionOrRedirect,
  getUserInformation,
  SessionInformation,
} from "@/app/api/auth/_session";

/**
 * Checks if a session exists and returns the username.
 * If no session exists, an error is thrown.
 */
export async function getSessionNameOrThrow(): Promise<string> {
  // random delay to avoid timing attacks
  await delayBetween(0, 100);
  const session = await getUserInformation();

  if (!session) {
    throw new Error("No session found");
  }

  return session.username;
}

/**
 * Checks if a session exists and returns it.
 * If no session exists, an error is thrown.
 */
export async function getSessionOrThrow(): Promise<SessionInformation> {
  // random delay to avoid timing attacks
  await delayBetween(0, 100);
  const session = await getSessionOrRedirect();

  if (!session) {
    throw new Error("No session found");
  }

  return session;
}
