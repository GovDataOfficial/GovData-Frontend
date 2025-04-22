import React, { memo } from "react";

import { ResourcePreviewError } from "@/app/suche/_components/ResourceTable/ResourcePreview/ResourcePreviewError";
import { ResourcePreviewLoading } from "@/app/suche/_components/ResourceTable/ResourcePreview/ResourcePreviewLoading";
import { ResourcePreviewMap } from "@/app/suche/_components/ResourceTable/ResourcePreview/ResourcePreviewMap";
import { useFetchPreviewData } from "@/app/suche/_components/ResourceTable/ResourcePreview/useFetchPreviewData";
import { i18n } from "@/i18n";
import { ResourceFormatShort } from "@/types/types";

const supportedResourceFormats: string[] = [ResourceFormatShort.geojson];
const isSupportedResourceFormat = (resourceFormat: string) =>
  supportedResourceFormats.includes(resourceFormat.toLowerCase());

const getResourcePreviewComponent = (
  props: ResourcePreview & { resourceData: any },
) => {
  switch (props.resourceFormat.toLowerCase()) {
    case ResourceFormatShort.geojson:
      return <ResourcePreviewMap {...props} />;
    default:
      return null;
  }
};

export type ResourcePreview = {
  metadataId: string;
  resourceFormat: string;
  resourceUrl: string;
  resourceId: string;
  mobile: boolean;
  tileUrl: string;
};

function ResourcePreview(props: ResourcePreview) {
  const { resourceUrl, resourceFormat } = props;
  const { data, isLoading, error } = useFetchPreviewData(
    resourceUrl,
    resourceFormat,
  );

  if (isLoading) {
    return <ResourcePreviewLoading />;
  }

  if (error) {
    return <ResourcePreviewError />;
  }

  const resourcePreviewComponent = getResourcePreviewComponent({
    ...props,
    resourceData: data,
  });

  return resourcePreviewComponent;
}

export type DtResourcePreview = ResourcePreview & {
  previewRef: React.RefObject<HTMLDivElement>;
};

const DtResourcePreviewComponent = (props: DtResourcePreview) => {
  const { previewRef, ...rest } = props;

  if (!isSupportedResourceFormat(props.resourceFormat)) {
    return null;
  }
  return (
    <>
      <dt>{i18n.t("search.details.preview.description")}</dt>
      <dd>
        <div className="mt-1" ref={previewRef}>
          <ResourcePreview {...rest}></ResourcePreview>
        </div>
      </dd>
    </>
  );
};

DtResourcePreviewComponent.displayName = "DtResourcePreview";

export const DtResourcePreview = memo(DtResourcePreviewComponent);
