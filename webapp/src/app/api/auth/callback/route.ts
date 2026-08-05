import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import * as client from "openid-client";

import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { getKeyCloakClient } from "@/app/api/auth/_keycloak";
import { getCodeVerifierSession, setSession } from "@/app/api/auth/_session";
import { logger } from "@/logger/logger";

export const dynamic = "force-dynamic";

const log = logger("callback route");

/**
 * Callback after successfully login in keycloak.
 */
export async function GET(request: NextRequest): Promise<Request> {
  const codeVerifierSession = await getCodeVerifierSession();

  if (!codeVerifierSession || !codeVerifierSession.codeVerifier) {
    redirect("/error");
  }

  // needs to be stored, since redirecting must happen outside of try/catch
  let redirectTo: string | undefined;

  try {
    const config = await getKeyCloakClient();

    // Use the stored redirectUri from the session - this is the exact URI we sent to Keycloak
    const redirectUri = codeVerifierSession.redirectUri;

    // Construct the full callback URL by combining:
    // - The correct host/path from redirectUri (request.url has wrong host: 0.0.0.0:3000 behind proxy)
    // - The query parameters from request.url (contains code and state sent by Keycloak)
    const actualCallbackUrl = new URL(redirectUri);
    actualCallbackUrl.search = new URL(request.url).search;

    // Exchange authorization code for tokens with PKCE verification and state validation
    const tokenSet = await client.authorizationCodeGrant(
      config,
      actualCallbackUrl,
      {
        pkceCodeVerifier: codeVerifierSession.codeVerifier,
        expectedState: codeVerifierSession.state,
      },
    );

    redirectTo = codeVerifierSession.redirectTo;

    codeVerifierSession.destroy();
    await setSession(tokenSet);
  } catch (error) {
    log.error(error, "Failed to exchange authorization code");
    if (codeVerifierSession) {
      codeVerifierSession.destroy();
    }
    return redirect("/error");
  }

  if (redirectTo) {
    return redirect(redirectTo);
  }
  return redirect(PAGES_AUTH.manage_metadata);
}
