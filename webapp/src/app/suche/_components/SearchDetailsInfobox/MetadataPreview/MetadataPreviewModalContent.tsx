"use client";

import { useRef, useState } from "react";

import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { useCodeContentFetch } from "@/app/_lib/hooks/useCodeContentFetch";
import { useDownloadClick } from "@/app/_lib/hooks/useDownloadClick";
import { PreviewLoading } from "@/app/suche/_components/common/PreviewLoading";
import { MetadataPreviewCodeblock } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewCodeblock";
import { MetadataPreviewDownloadButton } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewDownloadButton";
import { MetadataPreviewFileSuffix } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewFileFormats";
import { MetadataPreviewFileSuffixSelect } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewFileSuffixSelect";
import { i18n } from "@/i18n";

export type MetadataPreviewModalContent = {
  metadataName: string;
};
export function MetadataPreviewModalContent({
  metadataName,
}: MetadataPreviewModalContent) {
  const { t } = i18n;
  const downloadButtonRef = useRef<HTMLButtonElement>(null);
  const [fileSuffix, setFileSuffix] = useState<MetadataPreviewFileSuffix>(
    MetadataPreviewFileSuffix.TURTLE,
  );

  const { codeContent, isLoading, hasError, liveRegionMessage } =
    useCodeContentFetch(metadataName, fileSuffix);

  // creates a download link for the file
  const { handleDownload } = useDownloadClick(metadataName, fileSuffix);

  return (
    <div className="metadata-preview d-flex flex-column">
      <div className="d-flex mb-2 align-items-start flex-column flex-sm-row align-items-sm-end">
        <MetadataPreviewFileSuffixSelect
          fileSuffix={fileSuffix}
          onSuffixChange={setFileSuffix}
        />
        {!isLoading && !hasError && codeContent && (
          <MetadataPreviewDownloadButton
            ref={downloadButtonRef}
            onDownload={() => handleDownload(codeContent)}
          />
        )}
      </div>
      <div>
        {isLoading ? (
          <PreviewLoading
            loadingText={t(
              "search.details.infobox.metaDataDownload.modal.loading",
            )}
          />
        ) : hasError ? (
          <InfoBox
            variant="error"
            title={t(
              "search.details.infobox.metaDataDownload.modal.error.title",
            )}
          />
        ) : (
          // tabindex set to -1 so that the container does not get focus in firefox
          // the pre element will get focus directly when the code block is focused
          <div
            className="metadata-preview-code-content outline-margin"
            tabIndex={-1}
          >
            <div aria-live="polite" className="sr-only">
              {liveRegionMessage}
            </div>
            {/* needed to show the focus outline */}
            <div className="outline-padding">
              <MetadataPreviewCodeblock
                codeContent={codeContent}
                suffix={fileSuffix}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
