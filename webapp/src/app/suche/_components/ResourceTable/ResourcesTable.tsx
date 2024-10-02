"use client";

import { MetaData } from "@/types/types";
import { Fragment } from "react";
import { ResourcesTableRowTop } from "@/app/suche/_components/ResourceTable/ResourcesTableRowTop";
import { ResourcesTableRowBottom } from "@/app/suche/_components/ResourceTable/ResourcesTableRowBottom";
import { i18n } from "@/i18n";
import { useResourceTable } from "@/app/suche/_components/ResourceTable/useResourceTable";

type ResourcesTable = {
  data?: MetaData;
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

export function ResourcesTable({ data }: ResourcesTable) {
  const { openIds, handleOnClick } = useResourceTable();

  return (
    <div className="gd-table-wrapper d-none d-md-block">
      <table className="gd-table gd-table-accordion">
        <thead className="gd-table-head">
          <tr>
            <TableHead
              id="th-title"
              label={i18n.t("resource.table.head.title")}
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
            const isOpen = openIds[resource.id];
            const isAvailable = !data?.notAvailableResourceLinks?.includes(
              resource.url,
            );

            return (
              <Fragment key={resource.id}>
                <ResourcesTableRowTop
                  resource={resource}
                  open={isOpen}
                  onClick={handleOnClick}
                />
                <ResourcesTableRowBottom
                  resource={resource}
                  open={isOpen}
                  available={isAvailable}
                />
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
