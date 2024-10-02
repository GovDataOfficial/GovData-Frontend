import { MiddlewareFactory } from "@/middlewares/types";
import { NextResponse } from "next/server";
import { PAGES, PAGES_AUTH } from "@/app/_lib/URLHelper";

/**
 * Auth middleware for future connection with keycloak.
 */
export const withAuthMiddleware: MiddlewareFactory = (request) => {
  const pathname = request.nextUrl.pathname;
  const isInternPage = pathname.startsWith(PAGES_AUTH.manage_data);
  const isInternApi = pathname.startsWith("/api" + PAGES_AUTH.manage_data);
  const isIntern = isInternPage || isInternApi;
  const isActive =
    process.env.metadataform_active !== undefined &&
    process.env.metadataform_active !== "";
  if (isIntern && !isActive) {
    return () => NextResponse.redirect(new URL(PAGES.root, request.url));
  }
};
