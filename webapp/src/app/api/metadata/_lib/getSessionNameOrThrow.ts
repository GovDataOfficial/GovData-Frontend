"server-only";

import { getUserInformation } from "@/app/api/auth/_session";
import { delayBetween } from "@/app/_lib/debounce";

/**
 * Checks if a session exists and returns the username.
 * If no session exists, an error is thrown.
 */
export async function getSessionNameOrThrow(): Promise<string> {
  // random delay to avoid timing attacks
  await delayBetween(100, 300);
  const session = await getUserInformation();

  if (!session) {
    throw new Error("No session found");
  }

  return session.username;
}
