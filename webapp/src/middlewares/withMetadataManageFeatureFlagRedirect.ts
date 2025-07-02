import { NextRequest, NextResponse } from "next/server";

import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import {
  API_ENDPOINTS_AUTH_BASE,
  API_ENDPOINTS_MANAGE_DATA_BASE,
  API_ENDPOINTS_METADATA_BASE,
} from "@/app/api/apiEndpoints";
import { logger } from "@/logger/logger";
import { MiddlewareFactory } from "@/middlewares/types";

const log = logger("withMetaDataManageFeatureFlagRedirect.ts");

/**
 * Middleware for feature flag redirections of 'datenpflege' routes.
 *
 * Nextjs middleware is run in edge runtime!
 * therefore
 *  - we can *not* use libraries that depend on nodejs crypto in middleware.
 *  - or use node libraries like redis.
 *  -> https://github.com/vercel/next.js/discussions/46722
 *  -> ideally this would be the place where we could check if a session is valid
 *     and if a user is authenticated and secure routes here.
 *     But we can't do that here.
 */
export const withMetaDataManageFeatureFlagRedirect: MiddlewareFactory = async (
  request: NextRequest,
) => {
  const pathname = request.nextUrl.pathname;
  const isInternPage = pathname.startsWith(PAGES_AUTH.manage_data);
  const isInternApi = pathname.startsWith(API_ENDPOINTS_MANAGE_DATA_BASE);
  const isKeycloakRoute = pathname.startsWith(API_ENDPOINTS_AUTH_BASE);
  const isRouteToSecure = isInternPage || isInternApi || isKeycloakRoute;
  const isActive = process.env.metadata_management_active === "1";

  if (isRouteToSecure && !isActive) {
    log.info("tried to access secure route while feature flag is off");
    return () => NextResponse.error();
  }
};
