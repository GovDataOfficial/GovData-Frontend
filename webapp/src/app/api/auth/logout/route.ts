import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import * as client from "openid-client";

import { checkFeatureFlagForEnvVarDataManagement } from "@/app/api/_lib/checkEnvVarFeatureFlags";
import {
  getKeyCloakClient,
  getPostLogoutUriFromRequest,
} from "@/app/api/auth/_keycloak";
import { deleteSession, getSession } from "@/app/api/auth/_session";
import { logger } from "@/logger/logger";

export const dynamic = "force-dynamic";
const log = logger("logout route");

export async function GET(request: NextRequest) {
  if (!checkFeatureFlagForEnvVarDataManagement()) {
    return new Response(null, { status: 501 });
  }

  // needs to be stored, since redirecting must happen outside of try/catch
  let endSessionUrl: URL;

  try {
    const config = await getKeyCloakClient();
    const session = await getSession();

    const endSessionParams: Record<string, string> = {
      post_logout_redirect_uri: getPostLogoutUriFromRequest(request),
    };

    if (session?.id_token) {
      endSessionParams.id_token_hint = session.id_token;
    }

    endSessionUrl = client.buildEndSessionUrl(config, endSessionParams);
    await deleteSession();
  } catch (error) {
    log.error(error, "Failed to logout");
    // Still delete the session even if Keycloak logout fails
    await deleteSession();
    return redirect("/");
  }

  return redirect(endSessionUrl.href);
}
