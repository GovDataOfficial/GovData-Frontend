/**
 * Custom React hook for fetching code content from a metadata endpoint.
 *
 * This hook manages the asynchronous fetching of file content based on metadata name and suffix.
 * The returned content is of type text, not JSON.
 *
 * @param metaDataName - The name of the metadata file to fetch content from
 * @param suffix - The file suffix/extension to append to the fetch request
 * ```
 */
import { useEffect, useState } from "react";

import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import { i18n } from "@/i18n";

export function useCodeContentFetch(metaDataName: string, suffix: string) {
  const [codeContent, setCodeContent] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [liveRegionMessage, setLiveRegionMessage] = useState<string>("");

  useEffect(() => {
    if (!metaDataName) {
      return;
    }

    let isMounted = true;

    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        setLiveRegionMessage("");

        // Use the API route to avoid CORS issues
        const apiUrl = `${API_ENDPOINTS.METADATA.FETCH_FILE(metaDataName)}?suffix=${encodeURIComponent(suffix)}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.text();

        // Only update state if component is still mounted
        if (isMounted) {
          setCodeContent(data);
          setLiveRegionMessage(
            i18n.t(
              "search.details.infobox.metaDataDownload.modal.fetch.success",
              {
                format: i18n.t(
                  `search.details.infobox.metaDataDownload.modal.format.${suffix.toLowerCase()}.name`,
                ),
              },
            ),
          );
        }
      } catch (err) {
        if (isMounted) {
          setHasError(true);
          setCodeContent(undefined); // Clear any previous content
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchContent();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [metaDataName, suffix]);

  return { codeContent, isLoading, hasError, liveRegionMessage };
}
