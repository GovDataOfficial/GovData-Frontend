import { MiddlewareFactory } from "@/middlewares/types";

/**
 * Adds unique id to request.
 * @param request
 */
export const withRequestIdMiddleware: MiddlewareFactory = (request) => {
  let uuid = crypto.randomUUID().split("-")[0];
  request.headers.set("x-request-id", uuid);
};
