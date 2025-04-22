"use client";

import {
  createNoJsLink,
  removeSearchParameters,
} from "@/app/suche/_components/ResourceTable/ResourcesTableRowTop";
import { ResourceTableMobileEntry } from "@/app/suche/_components/ResourceTable/ResourceTableMobileEntry";
import { useResourceTable } from "@/app/suche/_components/ResourceTable/useResourceTable";
import { Metadata } from "@/types/types";

export function ResourceTableMobile({
  tileUrl,
  data,
}: {
  tileUrl: string;
  data: Metadata;
}) {
  const { handleOnClick, openIds, paramsIds, searchParams, router, pathname } =
    useResourceTable();

  return (
    <div className="d-block d-md-none">
      {data.resources.map((resource) => {
        const isOpen = openIds[resource.id] || paramsIds.includes(resource.id);
        const isAvailable = !data?.notAvailableResourceLinks?.includes(
          resource.url,
        );

        const onClick = () => {
          removeSearchParameters(searchParams, router, pathname);
          handleOnClick(resource.id);
        };
        const createNoJsLinkForResource = () => {
          return createNoJsLink(searchParams, resource.id);
        };

        return (
          <ResourceTableMobileEntry
            tileUrl={tileUrl}
            metadataId={data.id}
            isAvailable={isAvailable}
            isOpen={isOpen}
            resource={resource}
            handleOnClick={onClick}
            createNoJsLink={createNoJsLinkForResource}
            key={resource.id}
          />
        );
      })}
    </div>
  );
}
