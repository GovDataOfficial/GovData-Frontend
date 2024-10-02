import { fetchSearchScrollResults } from "@/app/_lib/getData";
import { stripSearchResultHTMLContent } from "@/app/_lib/sanitizer/sanitizeHtml";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scrollId = searchParams.get("scrollId");

  if (scrollId) {
    const result = await fetchSearchScrollResults(scrollId);
    const resultsSanitized = result && stripSearchResultHTMLContent(result);
    return Response.json(resultsSanitized);
  }

  return Response.json([]);
}
