"use client";

import { ResourceTableEntry } from "@/app/suche/_components/ResourceTable/ResourceTableEntry";
import { useResourceTable } from "@/app/suche/_components/ResourceTable/useResourceTable";
import { i18n } from "@/i18n";
import { Metadata } from "@/types/types";

type ResourcesTable = {
  tileUrl: string;
  data?: Metadata;
};

function TableHead({
  id,
  label,
  className = "",
}: {
  id: string;
  label: string;
  className?: string;
}) {
  return (
    <th id={id} className={`text-nowrap text-left`}>
      <span className={className}>{label}</span>
    </th>
  );
}

export function ResourcesTable({ tileUrl, data }: ResourcesTable) {
  const { openIds, handleOnClick } = useResourceTable();

  return (
    <div className="gd-table-wrapper d-none d-md-block">
      <table className="gd-table gd-table-accordion">
        <thead className="gd-table-head">
          <tr>
            <TableHead
              id="th-title"
              label={i18n.t("resource.table.head.title")}
              className="ps-3"
            />
            <TableHead
              id="th-modified"
              label={i18n.t("resource.table.head.modified")}
            />
            <TableHead
              id="th-format"
              label={i18n.t("resource.table.head.format")}
            />
            <TableHead
              id="th-resource"
              className="opacity-0"
              label={i18n.t("resource.table.head.resource")}
            />
          </tr>
        </thead>

        <tbody>
          {data?.resources.map((resource) => {
            const isOpen = openIds[resource.id] || false;
            const isAvailable = !data?.notAvailableResourceLinks?.includes(
              resource.url,
            );

            return (
              <ResourceTableEntry
                tileUrl={tileUrl}
                metadataId={data.id}
                isAvailable={isAvailable}
                isOpen={isOpen}
                resource={resource}
                handleOnClick={handleOnClick}
                key={resource.id}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
