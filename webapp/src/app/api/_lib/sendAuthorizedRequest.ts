import { authHeader } from "@/app/_lib/getData";
import { SessionInformation } from "@/app/api/auth/_session";
import { logger } from "@/logger/logger";
import { HttpMethod } from "@/types/types";

const log = logger("sendAuthorizedRequest");

export async function sendAuthorizedRequestWithBasicAuth(
  username: string,
  endpoint: string,
  method: HttpMethod,
  bodyContent?: Object,
): Promise<Response | undefined> {
  return sendAuthorizedRequest(
    endpoint,
    method,
    authHeader,
    { User: username },
    bodyContent,
  );
}

export async function sendAuthorizedRequestWithBearer(
  session: SessionInformation,
  endpoint: string,
  method: HttpMethod,
  bodyContent?: Object,
): Promise<Response | undefined> {
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
      const timestamp = new Date().toISOString();
      log.error(response, "Response status not ok");
      return new Response(errorBody, {
        status: response.status,
        headers: {
          "X-Error-Timestamp": timestamp,
        },
      });
    }
    // https://community.vercel.com/t/nextresponse-throws-error-when-http-request-status-code-is-204/625
    const responseStatusText =
      response.status === 204 ? null : response.statusText;
    return new Response(responseStatusText, { status: response.status });
  } catch (e) {
    log.error(e, "Error sending request");
    const timestamp = new Date().toISOString();
    return new Response(null, {
      status: 500,
      headers: {
        "X-Error-Timestamp": timestamp,
      },
    });
  }
}
