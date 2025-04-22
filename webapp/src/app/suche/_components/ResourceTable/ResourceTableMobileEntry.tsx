import { useEffect } from "react";

import { AnchorButton } from "@/app/_components/Button/AnchorButton";
import { InfoBadge } from "@/app/_components/InfoBoxes/InfoBadge";
import { Tag } from "@/app/_components/Tag/Tag";
import { Time } from "@/app/_components/Time/Time";
import {
  DtDescription,
  DtLicense,
  DtShortendAvailability,
} from "@/app/suche/_components/common/CommonDtDd";
import { DtResourcePreview } from "@/app/suche/_components/ResourceTable/ResourcePreview/ResourcePreview";
import { ResourcePreviewIcon } from "@/app/suche/_components/ResourceTable/ResourcePreview/ResourcePreviewIcon";
import { useResourcePreview } from "@/app/suche/_components/ResourceTable/ResourcePreview/useResourcePreview";
import { getTitle } from "@/app/suche/_components/ResourceTable/ResourcesTableRowTop";
import { ResurceTableCopyToClipboardButton } from "@/app/suche/_components/ResourceTable/ResourceTableCopyToClipboardButton";
import { i18n } from "@/i18n";
import { MetadataResource } from "@/types/types";

export function ResourceTableMobileEntry({
  tileUrl,
  metadataId,
  isAvailable,
  isOpen,
  resource,
  handleOnClick,
  createNoJsLink,
}: {
  tileUrl: string;
  metadataId: string;
  isAvailable: boolean;
  isOpen: boolean;
  resource: MetadataResource;
  handleOnClick: () => void;
  createNoJsLink: () => string;
}) {
  const {
    id,
    nameOnlyText,
    descriptionOnlyText,
    modified,
    formatShort,
    license,
    url,
    shortendAvailability,
  } = resource;
  const { previewRef, scrollToResourcePreview } = useResourcePreview();

  const onPreviewIconClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    // if the preview already exists in the DOM, scroll to it
    if (isOpen) {
      scrollToResourcePreview();
    } else {
      handleOnClick();
    }
  };

  // wait for the preview to be rendered, then scroll to it
  useEffect(() => {
    if (isOpen) {
      scrollToResourcePreview();
    }
  }, [isOpen, scrollToResourcePreview]);

  return (
    <div key={id} className="border-bottom mb-4">
      <p className="mb-2 bold">{getTitle(nameOnlyText, formatShort)}</p>

      <dl>
        <dt>{i18n.t("resource.table.head.modified")}</dt>

        <dd className="mb-2">{modified ? <Time date={modified} /> : "-"}</dd>

        <dt className="m-0">{i18n.t("resource.table.head.format")}</dt>
        <dd>
          <span className="d-flex">
            <Tag className="mb-2" truncate title={formatShort}>
              {formatShort}
            </Tag>
            <ResourcePreviewIcon
              className="mb-2"
              formatShort={formatShort}
              onClick={onPreviewIconClick}
            />
          </span>
        </dd>
      </dl>

      {!isAvailable && (
        <InfoBadge className="mb-2">
          {i18n.t("resource.table.panel.unavailable")}
        </InfoBadge>
      )}

      <AnchorButton variant="secondary" className="d-block mb-2" href={url}>
        {i18n.t("resources.table.row.resource.button")}
      </AnchorButton>
      <ResurceTableCopyToClipboardButton url={url} />
      {isOpen && (
        <dl id={id} className="gd-common-dl d-block">
          <DtDescription
            term={i18n.t("resources.table.panel.description")}
            description={descriptionOnlyText}
          />
          <DtResourcePreview
            metadataId={metadataId}
            resourceFormat={formatShort}
            resourceUrl={url}
            resourceId={id}
            mobile={true}
            tileUrl={tileUrl}
            previewRef={previewRef}
          />
          <DtLicense license={license} />
          <DtShortendAvailability availability={shortendAvailability} />
        </dl>
      )}
      <a
        aria-expanded={isOpen}
        aria-controls={id}
        className={`d-inline-block mb-1 ${isOpen ? "mt-3" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          handleOnClick();
        }}
        href={createNoJsLink()}
      >
        {isOpen
          ? "weniger Informationen anzeigen"
          : "mehr Informationen anzeigen"}
      </a>
    </div>
  );
}
