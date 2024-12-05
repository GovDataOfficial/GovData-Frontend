import { NextRequest, NextResponse } from "next/server";

export type MiddlewareFactory = (
  request: NextRequest,
  response: NextResponse,
) => Promise<void | (() => NextResponse) | (() => Response)>;
