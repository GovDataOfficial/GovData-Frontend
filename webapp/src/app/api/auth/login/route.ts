import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import * as client from "openid-client";

import { checkFeatureFlagForDataManagement } from "@/app/api/_lib/checkFeatureFlags";
import {
  getCallbackUriFromRequest,
  getKeyCloakClient,
} from "@/app/api/auth/_keycloak";
import { setCodeVerifierSession } from "@/app/api/auth/_session";
import { logger } from "@/logger/logger";

export const dynamic = "force-dynamic";

const log = logger("login route");

export async function GET(request: NextRequest) {
  if (!checkFeatureFlagForDataManagement()) {
    return new Response(null, { status: 501 });
  }

  let authorizationUrl: URL;

  try {
    const config = await getKeyCloakClient();
    const code_verifier = client.randomPKCECodeVerifier();
    const state = client.randomState();
    const redirectTo = request.nextUrl.searchParams.get("redirectTo");
    const callbackUri = getCallbackUriFromRequest(request);

    await setCodeVerifierSession(
      code_verifier,
      state,
      callbackUri,
      redirectTo || undefined,
    );

    authorizationUrl = client.buildAuthorizationUrl(config, {
      scope: "openid",
      code_challenge: await client.calculatePKCECodeChallenge(code_verifier),
      code_challenge_method: "S256",
      redirect_uri: callbackUri,
      state: state,
    });
  } catch (error) {
    log.error("Failed to initiate login:", error);
    return redirect("/error");
  }

  return redirect(authorizationUrl.href);
}
