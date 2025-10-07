"server-only";

import { delayBetween } from "@/app/_lib/debounce";
import {
  getSessionAndRefreshIt,
  SessionInformation,
} from "@/app/api/auth/_session";

/**
 * Checks if a session exists and returns it.
 * If no session exists, an error is thrown.
 */
export async function getSessionOrThrow(): Promise<SessionInformation> {
  // random delay to avoid timing attacks
  await delayBetween(0, 100);
  const session = await getSessionAndRefreshIt();

  if (!session) {
    throw new Error("No session found");
  }

  return session;
}
