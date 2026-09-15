import { fetchSearchScrollResults } from "@/app/_lib/getData";
import { sanitizeSearchResultContent } from "@/app/_lib/markdown/renderMarkdown";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scrollId = searchParams.get("scrollId");

  if (scrollId) {
    const result = await fetchSearchScrollResults(scrollId);
    const resultsSanitized = result && sanitizeSearchResultContent(result);
    return Response.json(resultsSanitized);
  }

  return Response.json([]);
}
