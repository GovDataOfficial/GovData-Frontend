"server-only";

import { requestAsyncStorage } from "next/dist/client/components/request-async-storage.external";
import pino, { LoggerOptions, stdTimeFunctions } from "pino";

const isProd = process.env.NODE_ENV === "production";
const isEdgeRuntime = process.env.NEXT_RUNTIME === "edge";

/**
 * Internal method used to access the global request object.
 * It retrieves the value of the "x-correlation-id" header set from apache.
 * This function avoids using the headers() method because:
 *  - Using headers() marks routes as dynamic, which is not desired.
 *  - headers() throws errors on routes where the headers are not available, whereas this function returns null if the header is not present
 */
function getUnsafeCorrelationIdFromHeader(): string | undefined {
  return (
    requestAsyncStorage.getStore()?.headers.get("x-correlation-id") || undefined
  );
}

/**
 * Pino Destination depending on Runtime.
 * Edge Runtime for middleware does not support destination.
 * Node Runtime uses async destination for production to reduce load.
 *
 * This will log only to stdout in Edge and Node,
 * as recommended by pino
 * see: https://getpino.io/#/docs/help?id=log-to-different-streams
 */
const pinoDestination = isEdgeRuntime
  ? undefined
  : isProd
    ? pino.destination({ dest: 1, sync: false, minLength: 4096 })
    : pino.destination({ dest: 1, sync: true });

/**
 * Pino Logger Configuration for both Node and Edge Runtime.
 * browser config solely for edge runtime, remove when middleware supports node runtime.
 */
const pinoLoggerOptions: LoggerOptions = {
  level: process.env.log_level || "info",
  timestamp: stdTimeFunctions.isoTime,
  mixin: (_context, level, logger) => ({
    correlationId: getUnsafeCorrelationIdFromHeader(),
    levelLabel: logger.levels.labels[level].toUpperCase(),
  }),
  browser: {
    asObject: true,
    serialize: true,
    write: (log) => console.log(JSON.stringify(log)),
    formatters: {
      level: (label, level) => ({
        level,
        levelLabel: label.toUpperCase(),
        correlationId: getUnsafeCorrelationIdFromHeader(),
      }),
    },
  },
};

const pinoLogger = pino(pinoLoggerOptions, pinoDestination);

export const logger = (name: string = "") => {
  return pinoLogger.child({ name });
};
