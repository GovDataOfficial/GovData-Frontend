import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import {
  getCallbackUriFromRequest,
  getKeyCloakClient,
} from "@/app/api/auth/_keycloak";
import { getCodeVerifierSession, setSession } from "@/app/api/auth/_session";

export const dynamic = "force-dynamic";

/**
 * Callback after successfully login in keycloak.
 */
export async function GET(request: NextRequest): Promise<Request> {
  const codeVerifierSession = await getCodeVerifierSession();
  if (codeVerifierSession && codeVerifierSession.value) {
    const client = await getKeyCloakClient();
    const params = client.callbackParams(request.url);

    // checks that the redirect_uri is the same as the one used in the login request
    const tokenSet = await client.callback(
      getCallbackUriFromRequest(request),
      params,
      {
        code_verifier: codeVerifierSession.value,
      },
    );
    codeVerifierSession.destroy();
    await setSession(tokenSet);

    const redirectTo = request.nextUrl.searchParams.get("redirectTo");
    if (redirectTo) {
      return redirect(decodeURIComponent(redirectTo));
    }
    return redirect(PAGES_AUTH.manage_metadata);
  }

  return redirect("/error");
}
