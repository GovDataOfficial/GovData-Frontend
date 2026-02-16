import { authHeader } from "@/app/_lib/getData";
import { createErrorResponseWithTimestamp } from "@/app/api/_lib/errorResponseWithTimestamp";
import { getSessionOrThrow } from "@/app/api/_lib/getSessionOrThrow";
import { SessionInformation } from "@/app/api/auth/_session";
import { logger } from "@/logger/logger";
import { HttpMethod } from "@/types/types";

const log = logger("sendAuthorizedRequest");

export async function sendAuthorizedRequestWithBasicAuth(
  endpoint: string,
  method: HttpMethod,
  bodyContent?: Object,
): Promise<Response | undefined> {
  let username: string;
  try {
    const session = await getSessionOrThrow();
    username = session.username;
  } catch (error) {
    return createErrorResponseWithTimestamp(null, 401);
  }

  return sendAuthorizedRequest(
    endpoint,
    method,
    authHeader,
    { User: username },
    bodyContent,
  );
}

export async function sendAuthorizedRequestWithBearer(
  endpoint: string,
  method: HttpMethod,
  bodyContent?: Object,
): Promise<Response | undefined> {
  let session: SessionInformation;
  try {
    session = await getSessionOrThrow();
  } catch (error) {
    return createErrorResponseWithTimestamp(null, 401);
  }

  const authHeader = `Bearer ${session.access_token}`;
  return sendAuthorizedRequest(
    endpoint,
    method,
    authHeader,
    undefined,
    bodyContent,
  );
}

async function sendAuthorizedRequest(
  endpoint: string,
  method: HttpMethod,
  authHeader: string,
  additionalHeaderInformation?: HeadersInit,
  bodyContent?: Object,
): Promise<Response | undefined> {
  const body = bodyContent ? JSON.stringify(bodyContent) : undefined;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: authHeader,
    ...additionalHeaderInformation,
  };

  try {
    const response = await fetch(new URL(endpoint), {
      method,
      body,
      headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      log.error(response, "Response status not ok");
      return createErrorResponseWithTimestamp(errorBody, response.status);
    }
    // https://community.vercel.com/t/nextresponse-throws-error-when-http-request-status-code-is-204/625
    const responseStatusText =
      response.status === 204 ? null : response.statusText;
    return new Response(responseStatusText, { status: response.status });
  } catch (e) {
    log.error(e, "Error sending request");
    return createErrorResponseWithTimestamp();
  }
}
