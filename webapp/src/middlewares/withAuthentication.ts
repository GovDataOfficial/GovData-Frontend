import { NextRequest, NextResponse } from "next/server";

import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import { getSessionAndRefreshIt } from "@/app/api/auth/_session";
import { logger } from "@/logger/logger";
import { MiddlewareFactory } from "@/middlewares/types";

const log = logger("withAuthentication.ts");

export const withAuthentication: MiddlewareFactory = async (
  request: NextRequest,
) => {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith(PAGES_AUTH.manage_data)) {
    console.log("check session for ", pathname);
    const session = await getSessionAndRefreshIt();
    if (!session) {
      log.info("No session - redirect to login");
      const loginUrl = new URL(
        API_ENDPOINTS.AUTH.LOGIN,
        request.nextUrl.origin,
      );
      const redirectPath = request.nextUrl.pathname + request.nextUrl.search;
      loginUrl.searchParams.set("redirectTo", redirectPath);
      return () => NextResponse.redirect(loginUrl);
    }
  }
};
