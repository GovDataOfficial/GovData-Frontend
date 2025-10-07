import { NextRequest, NextResponse } from "next/server";

import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import { getUserInformation } from "@/app/api/auth/_session";
import { logger } from "@/logger/logger";
import { MiddlewareFactory } from "@/middlewares/types";

const log = logger("withAuthorization.ts");

export const withAuthorization: MiddlewareFactory = async (
  request: NextRequest,
) => {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith(PAGES_AUTH.manage_showcases) &&
    pathname !== PAGES_AUTH.manage_showcases
  ) {
    const userInformation = await getUserInformation();
    if (!userInformation) {
      const loginUrl = new URL(
        API_ENDPOINTS.AUTH.LOGIN,
        request.nextUrl.origin,
      );
      const redirectPath = request.nextUrl.pathname + request.nextUrl.search;
      loginUrl.searchParams.set("redirectTo", redirectPath);
      return () => NextResponse.redirect(loginUrl);
    }
    if (!userInformation.isShowcaseEditor) {
      const manageDataUrl = new URL(
        PAGES_AUTH.manage_showcases,
        request.nextUrl.origin,
      );
      // An error will be shown to the user on the manage showcases page
      // indicating that they do not have the required permissions
      // to view the requested page.
      log.info(`User is not a showcase editor - redirect to manage showcases`);
      return () => NextResponse.redirect(manageDataUrl);
    }
    return;
  }
};
