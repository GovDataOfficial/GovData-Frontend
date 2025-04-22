import { useEffect, useState } from "react";

import { ResourceFormatShort } from "@/types/types";

async function checkGeoJson(response: Response) {
  const contentType = response.headers.get("Content-Type");

  if (
    contentType &&
    (contentType.includes("application/json") ||
      contentType.includes("application/geo+json"))
  ) {
    return response.json();
  }
  throw new Error("Unexpected content type:" + contentType);
}

async function checkPreviewData(resourceFormat: string, response: Response) {
  switch (resourceFormat.toLowerCase()) {
    case ResourceFormatShort.geojson:
      return checkGeoJson(response);
    default:
      return response.json();
  }
}

async function loadPreviewData(resourceFomrat: string, url: string) {
  try {
    const response = await fetch(url, { cache: "force-cache" });
    if (response.status === 204) {
      return undefined;
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return await checkPreviewData(resourceFomrat, response);
  } catch (error) {
    throw new Error("Error fetching preview data from API");
  }
}

export function useFetchPreviewData(
  resourceUrl: string,
  resourceFormat_: string,
) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const resourceFormat = resourceFormat_.toLowerCase();

  useEffect(() => {
    let isMounted = true;
    setData(null);
    setError(null);
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const result = await loadPreviewData(resourceFormat, resourceUrl);

        if (!isMounted) {
          return;
        }
        if (result) {
          setData(result);
        } else {
          setError("Empty data");
        }
      } catch (error) {
        if (isMounted) {
          setError(error instanceof Error ? error.message : String(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { data, isLoading, error };
}
