import { Fragment } from "react";

import { useResourcePreview } from "@/app/suche/_components/ResourceTable/ResourcePreview/useResourcePreview";
import { ResourcesTableRowBottom } from "@/app/suche/_components/ResourceTable/ResourcesTableRowBottom";
import { ResourcesTableRowTop } from "@/app/suche/_components/ResourceTable/ResourcesTableRowTop";
import { MetadataResource } from "@/types/types";

type ResourceTableEntry = {
  tileUrl: string;
  metadataId: string;
  resource: MetadataResource;
  isOpen: boolean;
  isAvailable: boolean;
  handleOnClick: (id: string) => void;
};

export function ResourceTableEntry({
  tileUrl,
  metadataId,
  resource,
  isOpen,
  isAvailable,
  handleOnClick,
}: ResourceTableEntry) {
  const { previewRef, scrollToResourcePreview } = useResourcePreview();

  return (
    <Fragment key={resource.id}>
      <ResourcesTableRowTop
        resource={resource}
        open={isOpen}
        onClick={handleOnClick}
        scrollToResourcePreview={scrollToResourcePreview}
      />
      <ResourcesTableRowBottom
        metadataId={metadataId}
        resource={resource}
        open={isOpen}
        available={isAvailable}
        tileUrl={tileUrl}
        previewRef={previewRef}
      />
    </Fragment>
  );
}
