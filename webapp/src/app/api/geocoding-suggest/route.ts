import { fetchGeocodingSuggest, fetchOSMSuggest } from "@/app/_lib/getData";
import { isOSMActive } from "@/app/_lib/environment";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const sessionId = searchParams.get("sessionId");

  if (isOSMActive() && q) {
    try {
      const result = await fetchOSMSuggest(q);
      return Response.json(result);
    } catch (e) {
      return Response.json([]);
    }
  }

  if (q && sessionId) {
    try {
      const result = await fetchGeocodingSuggest(sessionId, q);
      return Response.json(result);
    } catch (e) {
      return Response.json([]);
    }
  }
  return Response.json([]);
}
