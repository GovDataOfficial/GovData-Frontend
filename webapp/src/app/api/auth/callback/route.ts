import {
  getCallbackUriFromRequest,
  getKeyCloakClient,
} from "@/app/api/auth/_keycloak";
import { getCodeVerifierSession, setSession } from "@/app/api/auth/_session";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Callback after successfully login in keycloak.
 */
export async function GET(request: NextRequest): Promise<Request> {
  const codeVerifierSession = await getCodeVerifierSession();
  if (codeVerifierSession && codeVerifierSession.value) {
    const client = await getKeyCloakClient();
    const params = client.callbackParams(request.url);
    const tokenSet = await client.callback(
      getCallbackUriFromRequest(request),
      params,
      {
        code_verifier: codeVerifierSession.value,
      },
    );
    codeVerifierSession.destroy();
    await setSession(tokenSet);
    return redirect(PAGES_AUTH.manage_data);
  }

  return redirect("/error");
}
