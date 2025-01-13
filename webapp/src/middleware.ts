import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/logger/logger";
import { MiddlewareFactory } from "@/middlewares/types";
import { withHeadersMiddleware } from "@/middlewares/withHeadersMiddleware";
import { withMetaDataManageFeatureFlagRedirect } from "@/middlewares/withMetaDataManageFeatureFlagRedirect";
import { withRedirectLegacyPaths } from "@/middlewares/withRedirectLegacyPaths";

/*
 * Match all request paths except for the ones starting with:
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - images/ (static image paths)
 * - favicon.ico (favicon file)
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|images/|favicon.ico).*)"],
};

const log = logger("middleware.ts");

const middlewareChain: MiddlewareFactory[] = [
  withMetaDataManageFeatureFlagRedirect,
  withRedirectLegacyPaths,
  withHeadersMiddleware,
];

export async function middleware(
  request: NextRequest,
): Promise<NextResponse | Response> {
  log.debug(`GET ${request.nextUrl}`);
  const response = new NextResponse();
  for (let i = 0; i < middlewareChain.length; i = i + 1) {
    const middlewareFunc = middlewareChain[i];
    const nextResponse = await middlewareFunc(request, response);
    if (nextResponse) {
      return nextResponse();
    }
  }

  return NextResponse.next({ request, headers: response.headers });
}
