export function createErrorResponseWithTimestamp(
  body?: string | null,
  status: number = 500,
): Response {
  const timestamp = new Date().toISOString();
  return new Response(body || null, {
    status,
    headers: {
      "X-Error-Timestamp": timestamp,
    },
  });
}
