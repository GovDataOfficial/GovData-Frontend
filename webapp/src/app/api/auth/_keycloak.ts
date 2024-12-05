"server-only";

/**
 * Authorization Code Flow.
 * -> https://github.com/panva/node-openid-client
 */
import { BaseClient, Issuer } from "openid-client";
import { NextRequest } from "next/server";
import { PAGES } from "@/app/_lib/URLHelper";
import { redirect } from "next/navigation";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import { logger } from "@/logger/logger";

export type KeycloakClient = BaseClient & {
  redirect_uris: string[];
};

const log = logger("keycloak");

/**
 * Get base Url from a request by headers.
 * Need to create dynamic redirect_uris based on incoming request,
 * to route to different domains for the same app.
 * -> request.url and request.nextUrl.origin are often 0.0.0.0 as app is behind proxy and bound to this.
 * -> no other way than to check headers for now.
 */
function getBaseUrlFromRequest(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host");
  const proto = request.headers.get("x-forwarded-proto");
  if (host && proto) {
    const firstHost = host.split(",")[0];
    return `${proto}://${firstHost}`;
  }

  return request.nextUrl.origin;
}

export function getCallbackUriFromRequest(request: NextRequest): string {
  const baseUrl = getBaseUrlFromRequest(request);
  return `${baseUrl}${API_ENDPOINTS.AUTH.CALLBACK}`;
}

export function getPostLogoutUriFromRequest(request: NextRequest): string {
  const baseUrl = getBaseUrlFromRequest(request);
  return `${baseUrl}${PAGES.logout}`;
}

export async function getKeyCloakClient(): Promise<KeycloakClient> {
  let keycloakIssuer = null;

  try {
    keycloakIssuer = await Issuer.discover(process.env.keycloak_issuer!);
  } catch (error) {
    log.error(error, "Can not discover keycloak");
    return redirect(PAGES.root);
  }

  let keycloakClient;

  try {
    keycloakClient = new keycloakIssuer.Client({
      client_id: process.env.keycloak_client_id!,
      client_secret: process.env.keycloak_client_secret,
      response_types: ["code"],
    });
  } catch (error) {
    log.error(error, "Can not create keycloak client");
    return redirect(PAGES.root);
  }
  return keycloakClient as KeycloakClient;
}
