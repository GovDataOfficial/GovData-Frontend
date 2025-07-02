import React, { PropsWithChildren } from "react";

import { Fieldset } from "@/app/_components/Inputs/Fieldset";
import { ShowcaseFormStepContainer } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/partials/ShowcaseFormStepContainer";
import { ShowcaseFormStepName } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/showcase-formConstants";
import { ShowcaseFormLinkFormPart } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/steps/links/ShowcaseFormLinkFormPart";
import { i18n } from "@/i18n";
import { ShowcaseData, ShowcaseFormLinkType } from "@/types/types";

type ShowcaseFormLinkFormContainer = PropsWithChildren<{
  showcaseLinkType: ShowcaseFormLinkType;
}>;

function ShowcaseFormLinkFormContainer({
  showcaseLinkType,
  children,
}: ShowcaseFormLinkFormContainer) {
  return (
    <Fieldset
      className="form-add-item-container"
      legend={i18n.t(`showcaseform.field.links.type.${showcaseLinkType}`)}
    >
      {children}
    </Fieldset>
  );
}

export type ShowcaseFormStepLinks = Omit<ShowcaseFormStepContainer, "name"> & {
  defaultUsecasePublisher?: string;
  defaultUsecaseSourceUrl?: string;
  defaultLinkToSourcesUrl?: string;
  defaultLinkToSourcesName?: string;
  defaultLinksToShowcase?: ShowcaseData["linksToShowcase"];
  defaultUsedDatasets?: ShowcaseData["usedDatasets"];
};

export function ShowcaseFormStepLinks({
  defaultLinksToShowcase,
  defaultUsedDatasets,
  defaultLinkToSourcesName,
  defaultLinkToSourcesUrl,
  defaultUsecasePublisher,
  defaultUsecaseSourceUrl,
}: ShowcaseFormStepLinks) {
  return (
    <ShowcaseFormStepContainer name={ShowcaseFormStepName.links}>
      <ShowcaseFormLinkFormContainer
        showcaseLinkType={ShowcaseFormLinkType.linksToShowcase}
      >
        <ShowcaseFormLinkFormPart
          defaultLinks={defaultLinksToShowcase}
          showcaseLinkType={ShowcaseFormLinkType.linksToShowcase}
          initialLinksCount={2}
        />
      </ShowcaseFormLinkFormContainer>
      <ShowcaseFormLinkFormContainer
        showcaseLinkType={ShowcaseFormLinkType.usedDatasets}
      >
        <ShowcaseFormLinkFormPart
          defaultLinks={defaultUsedDatasets}
          showcaseLinkType={ShowcaseFormLinkType.usedDatasets}
          initialLinksCount={2}
        />
      </ShowcaseFormLinkFormContainer>

      <ShowcaseFormLinkFormContainer
        showcaseLinkType={ShowcaseFormLinkType.linkToSources}
      >
        <ShowcaseFormLinkFormPart
          defaultLinks={[
            { name: defaultLinkToSourcesName, url: defaultLinkToSourcesUrl },
          ]}
          showcaseLinkType={ShowcaseFormLinkType.linkToSources}
          initialLinksCount={1}
          maxLinks={1}
        />
      </ShowcaseFormLinkFormContainer>
      <ShowcaseFormLinkFormContainer
        showcaseLinkType={ShowcaseFormLinkType.usecase}
      >
        <ShowcaseFormLinkFormPart
          defaultLinks={[
            { name: defaultUsecasePublisher, url: defaultUsecaseSourceUrl },
          ]}
          showcaseLinkType={ShowcaseFormLinkType.usecase}
          initialLinksCount={1}
          maxLinks={1}
        />
      </ShowcaseFormLinkFormContainer>
    </ShowcaseFormStepContainer>
  );
}
