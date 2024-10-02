import { fetchSearchSuggestions } from "@/app/_lib/getData";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (q) {
    const result = await fetchSearchSuggestions(q);
    return Response.json(result);
  }

  return Response.json([]);
}
