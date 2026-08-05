import { delayBetween } from "@/app/_lib/debounce";
import { logger } from "@/logger/logger";

const log = logger("GET api/metadata[...slug]");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  try {
    const { searchParams } = new URL(request.url);
    const suffix = searchParams.get("suffix");
    const metaDataName = (await params).slug.join("/");
    const backendUrl = process.env.BE_GD_CKAN_DATASET_URL;

    if (!metaDataName || !suffix) {
      return Response.json(
        {
          error: "Missing metaDataName parameter or suffix query parameter.",
        },
        { status: 400 },
      );
    }

    // Construct the full URL to the metadata file
    const targetUrl = `${backendUrl}/${metaDataName}.${suffix}`;

    await delayBetween(0, 100);
    const response = await fetch(targetUrl);
    if (!response.ok) {
      return new Response(null, {
        status: response.status,
      });
    }
    const content = await response.text();
    return new Response(content, {
      status: response.status,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=300", // Cache for 5 minutes
      },
    });
  } catch (error) {
    log.error(error, "Error fetching metadata");
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
