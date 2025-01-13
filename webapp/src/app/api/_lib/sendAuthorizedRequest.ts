import { authHeader } from "@/app/_lib/getData";
import { getSessionNameOrThrow } from "@/app/api/metadata/_lib/getSessionNameOrThrow";
import { logger } from "@/logger/logger";
import { HttpMethod } from "@/types/types";

const log = logger("sendAuthorizedRequest");

export async function sendAuthorizedRequest(
  endpoint: string,
  method: HttpMethod,
  bodyContent?: Object,
): Promise<Response | undefined> {
  let username;

  try {
    username = await getSessionNameOrThrow();
  } catch (error) {
    return new Response(null, { status: 401 });
  }

  const body = bodyContent ? JSON.stringify(bodyContent) : undefined;

  try {
    const response = await fetch(new URL(endpoint), {
      method,
      body,
      headers: {
        User: username,
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      log.error(response, "Response status not ok");
      return new Response(null, { status: response.status });
    }
    return new Response(response.statusText, { status: response.status });
  } catch (e) {
    log.error(e, "Error sending request");
    return new Response(null, { status: 500 });
  }
}
