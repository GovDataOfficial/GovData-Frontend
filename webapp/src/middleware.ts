import { NextRequest, NextResponse } from "next/server";
import { withRedirectLegacyPaths } from "@/middlewares/withRedirectLegacyPaths";
import { withRequestIdMiddleware } from "@/middlewares/withRequestIdMiddleware";
import { withAuthMiddleware } from "@/middlewares/withAuthMiddleware";
import { MiddlewareFactory } from "@/middlewares/types";
import { withHeadersMiddleware } from "@/middlewares/withHeadersMiddleware";

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

const middlewareChain: MiddlewareFactory[] = [
  withRequestIdMiddleware,
  withAuthMiddleware,
  withRedirectLegacyPaths,
  withHeadersMiddleware,
];

export function middleware(request: NextRequest): NextResponse {
  const response = new NextResponse();
  for (let i = 0; i < middlewareChain.length; i = i + 1) {
    const middlewareFunc = middlewareChain[i];
    const nextResponse = middlewareFunc(request, response);
    if (nextResponse) {
      return nextResponse();
    }
  }

  return NextResponse.next({ request, headers: response.headers });
}
