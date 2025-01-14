"use client";

import { AnchorButton } from "@/app/_components/Button/AnchorButton";
import { Button } from "@/app/_components/Button/Button";
import { InfoBadge } from "@/app/_components/InfoBoxes/InfoBadge";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { Tag } from "@/app/_components/Tag/Tag";
import { Time } from "@/app/_components/Time/Time";
import { useCopyToClipboard } from "@/app/_lib/hooks/useCopyToClipboard";
import {
  DtDescription,
  DtLicense,
  DtShortendAvailability,
} from "@/app/suche/_components/common/CommonDtDd";
import {
  createNoJsLink,
  getTitle,
  removeSearchParameters,
} from "@/app/suche/_components/ResourceTable/ResourcesTableRowTop";
import { ResurceTableCopyToClipboardButton } from "@/app/suche/_components/ResourceTable/ResourceTableCopyToClipboardButton";
import { useResourceTable } from "@/app/suche/_components/ResourceTable/useResourceTable";
import { i18n } from "@/i18n";
import { Metadata } from "@/types/types";

export function ResourceTableMobile({ data }: { data: Metadata }) {
  const { handleOnClick, openIds, paramsIds, searchParams, router, pathname } =
    useResourceTable();

  return (
    <div className="d-block d-md-none">
      {data.resources.map(
        ({
          id,
          nameOnlyText,
          descriptionOnlyText,
          modified,
          formatShort,
          license,
          url,
          shortendAvailability,
        }) => {
          const isOpen = openIds[id] || paramsIds.includes(id);
          const isAvailable = !data?.notAvailableResourceLinks?.includes(url);
          return (
            <div key={id} className="border-bottom mb-4">
              <p className="mb-2 bold">{getTitle(nameOnlyText, formatShort)}</p>

              <dl>
                <dt>{i18n.t("resource.table.head.modified")}</dt>

                <dd className="mb-2">
                  {modified ? <Time date={modified} /> : "-"}
                </dd>

                <dt className="m-0">{i18n.t("resource.table.head.format")}</dt>
                <dd>
                  <Tag className="mb-2" truncate title={formatShort}>
                    {formatShort}
                  </Tag>
                </dd>
              </dl>

              {!isAvailable && (
                <InfoBadge className="mb-2">
                  {i18n.t("resource.table.panel.unavailable")}
                </InfoBadge>
              )}

              <AnchorButton
                variant="secondary"
                className="d-block mb-2"
                href={url}
              >
                {i18n.t("resources.table.row.resource.button")}
              </AnchorButton>
              <ResurceTableCopyToClipboardButton url={url} />
              <dl
                id={id}
                className={isOpen ? "gd-common-dl d-block" : "d-none"}
                aria-hidden={!isOpen}
              >
                <DtDescription
                  term={i18n.t("resources.table.panel.description")}
                  description={descriptionOnlyText}
                />
                <DtLicense license={license} />
                <DtShortendAvailability availability={shortendAvailability} />
              </dl>
              <a
                aria-expanded={isOpen}
                aria-controls={id}
                className={`d-inline-block mb-1 ${isOpen ? "mt-3" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  removeSearchParameters(searchParams, router, pathname);
                  handleOnClick(id);
                }}
                href={createNoJsLink(searchParams, id)}
              >
                {isOpen
                  ? "weniger Informationen anzeigen"
                  : "mehr Informationen anzeigen"}
              </a>
            </div>
          );
        },
      )}
    </div>
  );
}
