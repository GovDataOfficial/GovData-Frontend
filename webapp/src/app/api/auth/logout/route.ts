import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import {
  getKeyCloakClient,
  getPostLogoutUriFromRequest,
} from "@/app/api/auth/_keycloak";
import { deleteSession, getSession } from "@/app/api/auth/_session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const client = await getKeyCloakClient();
  const session = await getSession();
  const endSessionUrl = client.endSessionUrl({
    id_token_hint: session?.id_token,
    post_logout_redirect_uri: getPostLogoutUriFromRequest(request),
  });
  await deleteSession();
  return redirect(endSessionUrl);
}
