import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { generators } from "openid-client";

import {
  getCallbackUriFromRequest,
  getKeyCloakClient,
} from "@/app/api/auth/_keycloak";
import { setCodeVerifierSession } from "@/app/api/auth/_session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const client = await getKeyCloakClient();
  const code_verifier = generators.codeVerifier();
  await setCodeVerifierSession(code_verifier);

  const callbackUri = getCallbackUriFromRequest(request);

  const authorizationUrl = client.authorizationUrl({
    scope: "openid",
    code_challenge: generators.codeChallenge(code_verifier),
    code_challenge_method: "S256",
    redirect_uri: callbackUri,
  });

  return redirect(authorizationUrl);
}
