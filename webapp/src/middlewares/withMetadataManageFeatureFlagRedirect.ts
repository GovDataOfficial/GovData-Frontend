import { NextRequest, NextResponse } from "next/server";

import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { logger } from "@/logger/logger";
import { MiddlewareFactory } from "@/middlewares/types";

const log = logger("withDataManageFeatureFlagRedirect.ts");

export const withDataManageFeatureFlagRedirect: MiddlewareFactory = async (
  request: NextRequest,
) => {
  const pathname = request.nextUrl.pathname;
  const isInternPage = pathname.startsWith(PAGES_AUTH.manage_data);
  const isActive = process.env.data_management_active === "1";

  if (isInternPage && !isActive) {
    return () => NextResponse.error();
  }
};
