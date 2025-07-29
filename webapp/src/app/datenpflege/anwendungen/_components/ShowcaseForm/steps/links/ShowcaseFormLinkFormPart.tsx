import { Button } from "@/app/_components/Button/Button";
import { ButtonIcon } from "@/app/_components/Button/ButtonIcon";
import { InputText } from "@/app/_components/Inputs/InputText";
import { InputUrl } from "@/app/_components/Inputs/InputUrl";
import { icons } from "@/app/_components/SVG/iconMap";
import { SVG } from "@/app/_components/SVG/SVG";
import {
  MAX_SHOWCASE_LINKS_COUNT,
  SHOWCASE_FORM_INPUTS,
  SHOWCASE_FORM_MAX_LENGTH_SMALL,
} from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/showcase-formConstants";
import {
  ShowcaseLinkData,
  useShowcaseFormLinks,
} from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/steps/links/useShowcaseFormLinks";
import { i18n } from "@/i18n";
import { ShowcaseFormLinkType } from "@/types/types";

type ShowcaseLinkInputGroup = {
  showcaseLinkType: ShowcaseFormLinkType;
  deleteLink: (
    event: React.MouseEvent<HTMLButtonElement>,
    linkId: string,
    linkName?: string,
  ) => void;
  linkId: string;
  defaultName?: string;
  defaultUrl?: string;
  linkName?: string;
  ref?: React.Ref<HTMLInputElement>;
};

export const ShowcaseLinkInputGroup = ({
  ref,
  showcaseLinkType,
  deleteLink,
  linkId,
  defaultName,
  defaultUrl,
  linkName,
}: ShowcaseLinkInputGroup) => {
  const linkInput = SHOWCASE_FORM_INPUTS.LINK(showcaseLinkType, linkName);
  return (
    <div className="d-flex w-100">
      <InputText
        className="flex-grow-1 pe-1"
        name={linkInput.name}
        label={i18n.t("showcaseform.field.links.name", { name: linkName })}
        defaultValue={defaultName}
        ref={ref}
        maxLength={SHOWCASE_FORM_MAX_LENGTH_SMALL}
      />
      <InputUrl
        className="flex-grow-1"
        name={linkInput.url}
        label={i18n.t("showcaseform.field.links.url", { name: linkName })}
        defaultValue={defaultUrl}
        maxLength={SHOWCASE_FORM_MAX_LENGTH_SMALL}
      />
      <div className="d-flex align-items-center">
        <ButtonIcon
          className="gd-button-icon-tertiary"
          size="big"
          icon={icons.trash}
          onClick={(event) => deleteLink(event, linkId, linkName)}
          title={
            linkId
              ? i18n.t("showcaseform.field.links.delete", {
                  name: linkName,
                })
              : i18n.t("showcaseform.field.links.delete.noName")
          }
        />
      </div>
    </div>
  );
};

ShowcaseLinkInputGroup.displayName = "ShowcaseLinkInputGroup";

export type ShowcaseFormLinkFormPart = {
  showcaseLinkType: ShowcaseFormLinkType;
  defaultLinks?: ShowcaseLinkData[];
  maxLinks?: number;
  initialLinksCount?: number;
};

export function ShowcaseFormLinkFormPart({
  showcaseLinkType,
  defaultLinks,
  maxLinks,
  initialLinksCount = 1,
}: ShowcaseFormLinkFormPart) {
  const {
    addNewLink,
    deleteLink,
    liveRegionMessage,
    visibleLinks,
    setFirstInputRef,
    addButtonRef,
  } = useShowcaseFormLinks({
    maxLinks,
    initialLinksCount,
    defaultLinks,
  });

  return (
    <>
      {visibleLinks?.map((linkData, index) => (
        <ShowcaseLinkInputGroup
          showcaseLinkType={showcaseLinkType}
          key={linkData.id}
          linkId={linkData.id}
          deleteLink={deleteLink}
          defaultName={linkData.link?.name}
          defaultUrl={linkData.link?.url}
          linkName={
            (maxLinks && maxLinks > 1) || !maxLinks ? `${index + 1}` : ""
          }
          ref={index === visibleLinks.length - 1 ? setFirstInputRef : null}
        />
      ))}
      {visibleLinks.length < MAX_SHOWCASE_LINKS_COUNT &&
        (maxLinks ? visibleLinks.length < maxLinks : true) && (
          <Button
            variant="secondary"
            onClick={(event) => addNewLink(event)}
            ref={addButtonRef}
            className="align-self-start"
          >
            <SVG icon={icons.plus} size="14" />
            <span className="ms-0_5">
              {i18n.t("showcaseform.field.links.add")}
            </span>
          </Button>
        )}
      <div aria-live="polite" className="sr-only">
        {liveRegionMessage}
      </div>
    </>
  );
}
