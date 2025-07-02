"use client";

import { useRef } from "react";

import { RequiredAsteriskInfo } from "@/app/_components/Inputs/partials/RequiredAsteriskInfo";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { Trans } from "@/app/_components/Trans/Trans";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { ShowcaseFormBottomNavigation } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/partials/ShowcaseFormBottomNavigation";
import { ShowcaseFormRequestError } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/partials/ShowcaseFormRequestError";
import {
  SHOWCASE_FORM_ID,
  SHOWCASE_FORM_INPUTS,
} from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/showcase-formConstants";
import { ShowcaseFormStepLinks } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/steps/links/ShowcaseFormStepLinks";
import { ShowcaseFormStepContact } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/steps/ShowcaseFormStepContact";
import { ShowcaseFormStepContents } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/steps/ShowcaseFormStepContents";
import { ShowcaseFormNavigation } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/stickyNav/ShowcaseFormNavigation";
import { useShowcaseForm } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/useShowcaseForm";
import { i18n } from "@/i18n";
import { CategoriesSorted, ShowcaseData } from "@/types/types";

type ShowcaseForm = {
  categories?: CategoriesSorted;
  showcaseData?: ShowcaseData;
};

export function ShowcaseForm({ categories, showcaseData }: ShowcaseForm) {
  const showcaseId = showcaseData?.id;
  const infoRef = useRef<HTMLDivElement>(null);

  const { requestError, formProps } = useShowcaseForm({ showcaseId, infoRef });
  const { t } = i18n;

  return (
    <div className="form-container">
      <div className="form-header-container">
        <div className="mb-2_5">
          <a href={PAGES_AUTH.manage_showcases}>
            <SVG icon={icons.arrowLeftLongBlue} size={"big"} />
            <span className="ms-1_5">
              {i18n.t("showcaseform.navigation.myDatasets")}
            </span>
          </a>
        </div>
        <div ref={infoRef}>
          {requestError && (
            <ShowcaseFormRequestError requestError={requestError} />
          )}
        </div>
        <h1>
          {showcaseId ? t("showcaseform.edit") : t("showcaseform.create")}
        </h1>
        {showcaseId && (
          <Trans
            i18nKey="showcaseform.edit.current"
            params={{
              name: (
                <strong className="edit-description-title">
                  „{showcaseData?.title}”
                </strong>
              ),
            }}
            htmlElement="paragraph"
            className="paragraph-small"
          />
        )}
      </div>
      <div className="form-sticky-nav-container">
        <ShowcaseFormNavigation />
      </div>
      <form id={SHOWCASE_FORM_ID} {...formProps}>
        <div className="form-step-container">
          <RequiredAsteriskInfo className="mt-2" />

          {showcaseId && showcaseData && (
            <input
              type="hidden"
              name={SHOWCASE_FORM_INPUTS.ID}
              value={showcaseData.id}
            />
          )}
          <ShowcaseFormStepContents
            categories={categories}
            defaultTitle={showcaseData?.title}
            defaultNotes={showcaseData?.notes}
            defaultShowcaseTypes={showcaseData?.showcaseTypes}
            defaultCategories={showcaseData?.categories}
            defaultKeywords={showcaseData?.keywords}
            defaultManualShowcaseCreatedDate={
              showcaseData?.manualShowcaseCreatedDate
            }
            defaultManualShowcaseModifiedDate={
              showcaseData?.manualShowcaseModifiedDate
            }
            defaultPlatforms={showcaseData?.platforms}
            defaultSpatial={showcaseData?.spatial}
            defaultImages={showcaseData?.images}
          />
          <ShowcaseFormStepLinks
            defaultUsecasePublisher={showcaseData?.usecasePublisher}
            defaultUsecaseSourceUrl={showcaseData?.usecaseSourceUrl}
            defaultLinkToSourcesUrl={showcaseData?.linkToSourcesUrl}
            defaultLinkToSourcesName={showcaseData?.linkToSourcesName}
            defaultLinksToShowcase={showcaseData?.linksToShowcase}
            defaultUsedDatasets={showcaseData?.usedDatasets}
          />
          <ShowcaseFormStepContact defaultContact={showcaseData?.contact} />
          <ShowcaseFormBottomNavigation
            submitButtonTitle={
              showcaseId
                ? t("showcaseform.navigation.submit.edit")
                : t("showcaseform.navigation.submit.create")
            }
          />
        </div>
      </form>
    </div>
  );
}
