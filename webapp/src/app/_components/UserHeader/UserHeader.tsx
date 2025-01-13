"use server";

import { UserHeaderNavigation } from "@/app/_components/UserHeader/partials/UserHeaderNavigation";
import { getUserInformation } from "@/app/api/auth/_session";

/**
 * Navigation for logged-in Users.
 * This here is required to check on the server if user is logged in.
 */
export async function UserHeader() {
  const userInformation = await getUserInformation();

  return userInformation ? (
    <UserHeaderNavigation userName={userInformation.username} />
  ) : null;
}
