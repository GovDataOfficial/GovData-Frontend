import { useCallback } from "react";

// MIME type mapping for common file extensions
const getMimeType = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    ttl: "text/turtle",
    rdf: "application/rdf+xml",
    jsonld: "application/ld+json",
    n3: "text/n3",
  };

  return mimeTypes[extension.toLowerCase()] || "text/plain";
};

// Fallback download function that doesn't create accessibility conflicts
const triggerDownloadFallback = (
  url: string,
  filename: string,
  fileExtension: string,
) => {
  // Create a temporary link but don't add click handlers that conflict with user interaction
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.${fileExtension}`;

  // Trigger download by simulating user interaction
  // This avoids that the user perseves a double click
  // and helps assistive technologies understand it's a download action
  const clickEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
    // Mark as synthetic to help assistive technologies
    detail: 0,
  });

  link.dispatchEvent(clickEvent);
};

// Sanitize filename to remove invalid characters for file system
const sanitizeFilename = (filename: string): string => {
  // Remove or replace characters that are invalid in filenames
  return filename
    .replace(/[<>:"/\\|?*]/g, "_") // Replace invalid characters with underscore
    .replace(/\s+/g, "_") // Replace spaces with underscore
    .replace(/\.+$/, "") // Remove trailing dots
    .substring(0, 255); // Limit length to 255 characters
};

export function useDownloadClick(
  filename: string,
  fileExtension: string,
  apiUrl?: string,
) {
  const handleDownload = useCallback(
    async (content?: string) => {
      try {
        // Sanitize the filename to ensure it's valid for file systems
        const sanitizedFilename = sanitizeFilename(filename);

        // Determine MIME type based on file extension
        const mimeType = getMimeType(fileExtension);

        // If we have content immediately, try File System Access API first
        if (
          content &&
          "showSaveFilePicker" in window &&
          window.isSecureContext
        ) {
          try {
            const fileHandle = await (window as any).showSaveFilePicker({
              suggestedName: `${sanitizedFilename}.${fileExtension}`,
              types: [
                {
                  description: `${fileExtension.toUpperCase()} files`,
                  accept: { [mimeType]: [`.${fileExtension}`] },
                },
              ],
              excludeAcceptAllOption: false,
            });

            const blob = new Blob([content], { type: mimeType });
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
            return; // Early exit after successful download
          } catch (err) {
            // Check if the user cancelled the dialog
            if (err instanceof Error && err.name === "AbortError") {
              return; // Exit without downloading - user cancelled
            }
            throw err;
          }
        }

        // Fallback approach
        let downloadContent = content;

        // If content is not provided, fetch it using the apiUrl
        if (!downloadContent && apiUrl) {
          const response = await fetch(apiUrl);

          if (!response.ok) {
            throw new Error(
              `Failed to download: ${response.status} ${response.statusText}`,
            );
          }

          downloadContent = await response.text();
        }

        if (!downloadContent) {
          throw new Error(
            "No content available for download and no API URL provided",
          );
        }

        // Create a blob with the content and appropriate MIME type
        const blob = new Blob([downloadContent], { type: mimeType });
        const url = URL.createObjectURL(blob);

        triggerDownloadFallback(url, sanitizedFilename, fileExtension);

        // Clean up the blob URL after a short delay to ensure download starts
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (error) {
        console.error("Download failed:", error);
      }
    },
    [filename, apiUrl, fileExtension],
  );

  return { handleDownload };
}
