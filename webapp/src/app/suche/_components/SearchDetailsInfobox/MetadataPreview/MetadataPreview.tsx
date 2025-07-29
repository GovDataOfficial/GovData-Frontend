"use client";

import { useEffect, useState } from "react";

import { MetadataPreviewDownloadAnchor } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewDownloadAnchor";
import { MetadataPreviewModal } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewModal";

export type MetadataPreview = {
  metadataName: string;
  backendUrl?: string; // Optional, used for creating download links
};

export function MetadataPreview({ metadataName, backendUrl }: MetadataPreview) {
  const [isJsEnabled, setIsJsEnabled] = useState(false);

  useEffect(() => {
    // If useEffect runs, JavaScript is enabled
    setIsJsEnabled(true);
  }, []);

  if (!isJsEnabled) {
    return (
      <MetadataPreviewDownloadAnchor
        metadataName={metadataName}
        backendUrl={backendUrl} // Assuming backendUrl is defined in the context
      />
    );
  }
  return <MetadataPreviewModal metadataName={metadataName} />;
}
