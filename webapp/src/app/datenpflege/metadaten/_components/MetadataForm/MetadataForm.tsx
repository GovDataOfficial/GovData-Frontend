"use client";

import { useRef } from "react";

import { RequiredAsteriskInfo } from "@/app/_components/Inputs/partials/RequiredAsteriskInfo";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { Trans } from "@/app/_components/Trans/Trans";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import {
  METADATA_FORM_ID,
  METADATA_FORM_INPUTS,
} from "@/app/datenpflege/metadaten/_components/MetadataForm/metadata-formConstants";
import { MetadataFormHelpBox } from "@/app/datenpflege/metadaten/_components/MetadataForm/partials/MetadataFormHelpBox";
import { MetadataFormRequestError } from "@/app/datenpflege/metadaten/_components/MetadataForm/partials/MetadataFormRequestError";
import { MetadataFormStepContacts } from "@/app/datenpflege/metadaten/_components/MetadataForm/steps/contacts/MetadataFormStepContacts";
import { MetadataFormStickyNavigation } from "@/app/datenpflege/metadaten/_components/MetadataForm/stickNav/MetadataFormStickyNavigation";
import { useMetadataForm } from "@/app/datenpflege/metadaten/_components/MetadataForm/useMetadataForm";
import { useMetadataFormNavigation } from "@/app/datenpflege/metadaten/_components/MetadataForm/useMetadataFormNavigation";
import { i18n } from "@/i18n";
import {
  CategoriesSorted,
  LicenseActiveSorted,
  Metadata,
  OrganizationSorted,
} from "@/types/types";

import { MetadataFormBottomNavigation } from "./partials/MetadataFormBottomNavigation";
import { MetadataFormStepAdditional } from "./steps/MetadataFormStepAdditional";
import { MetadataFormStepContents } from "./steps/MetadataFormStepContents";
import { MetadataFormStepData } from "./steps/MetadataFormStepData";
import { MetadataFormStepGeo } from "./steps/MetadataFormStepGeo";
import { MetadataFormStepTime } from "./steps/MetadataFormStepTime";
import { MetadataFormStepResources } from "./steps/resources/MetadataFormStepResources";

type MetadataForm = {
  categories?: CategoriesSorted;
  licenses?: LicenseActiveSorted;
  organizations: OrganizationSorted;
  metadata?: Metadata;
  mailFitko: string;
  metadataGuideLink: string;
  metadataDcatapLink: string;
};

export function MetadataForm({
  categories,
  licenses,
  organizations,
  metadata,
  mailFitko,
  metadataGuideLink,
  metadataDcatapLink,
}: MetadataForm) {
  const editMode = !!metadata;
  const infoRef = useRef<HTMLDivElement>(null);

  const { requestError, detailedErrorInfo, formProps } = useMetadataForm({
    editMode,
    infoRef,
  });

  const {
    setStepAndFocusFirstVisibleInput,
    currentStep,
    setCurrentStep,
    reportValidity,
    isSummary,
    checkValidityOfStep,
  } = useMetadataFormNavigation({ editMode });

  const { t } = i18n;

  return (
    <div className="form-container">
      <div className="form-header-container">
        <div className="mb-2_5">
          <a href={PAGES_AUTH.manage_metadata}>
            <SVG icon={icons.arrowLeftLong} size={"big"} className="primary" />
            <span className="ms-1_5">
              {i18n.t("metadataform.navigation.myDatasets")}
            </span>
          </a>
        </div>
        <div ref={infoRef}>
          {isSummary && requestError && (
            <MetadataFormRequestError
              requestError={requestError}
              mailFitko={mailFitko}
              timeStamp={detailedErrorInfo?.timestamp}
            />
          )}
        </div>
        <h1>{editMode ? t("metadataform.edit") : t("metadataform.create")}</h1>
        {editMode && (
          <Trans
            i18nKey="metadataform.edit.current"
            params={{
              name: (
                <strong className="edit-description-title">
                  „{metadata?.title}”
                </strong>
              ),
            }}
            htmlElement="paragraph"
            className="paragraph-small"
          />
        )}
      </div>
      <div className="form-sticky-nav-container">
        <MetadataFormStickyNavigation
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          checkValidityOfStep={checkValidityOfStep}
          editMode={editMode}
        />
      </div>
      <form id={METADATA_FORM_ID} {...formProps}>
        <div className="form-step-container">
          <MetadataFormHelpBox
            metadataGuideLink={metadataGuideLink}
            metadataDcatapLink={metadataDcatapLink}
          />
          {isSummary && (
            <>
              <h2 className="mb-1">{i18n.t("metadataform.step.summary")}</h2>
              <p className="mt-0">
                {i18n.t("metadataform.step.summary.description")}
              </p>
            </>
          )}
          <RequiredAsteriskInfo className="mt-2" />

          {editMode && metadata && (
            <input
              type="hidden"
              name={METADATA_FORM_INPUTS.ID}
              value={metadata.id}
            />
          )}

          <MetadataFormStepData
            forStep={0}
            currentStep={currentStep}
            organizations={organizations}
            defaultOrgId={metadata?.owner_org}
            defaultContributerId={metadata?.contributorID}
          />
          <MetadataFormStepContents
            forStep={1}
            currentStep={currentStep}
            categories={categories}
            defaultDescription={metadata?.notes}
            defaultTitle={metadata?.title}
            defaultTags={metadata?.tags}
            defaultCategories={metadata?.categories}
            defaultHvdCategories={metadata?.hvdCategories}
            defaultWebsite={metadata?.url}
          />
          <MetadataFormStepContacts
            forStep={2}
            currentStep={currentStep}
            defaultContacts={metadata?.contacts}
          />
          <MetadataFormStepGeo
            forStep={3}
            currentStep={currentStep}
            defaultPoliciticalGeocodingLevelURI={
              metadata?.policiticalGeocodingLevelURI
            }
            defaultPoliciticalGeocodingURI={metadata?.politicalGeocodingURI}
            defaultGeocodingText={metadata?.geocodingText}
            defaultSpatial={metadata?.spatial}
          />
          <MetadataFormStepTime
            forStep={4}
            currentStep={currentStep}
            defaultTemporalCoverageFrom={metadata?.temporalCoverageFrom}
            defaultTemporalCoverageTo={metadata?.temporalCoverageTo}
            defaultLastModifiedDate={metadata?.lastModifiedDate}
            defaultPublished={metadata?.published}
          />
          <MetadataFormStepResources
            forStep={5}
            currentStep={currentStep}
            licenses={licenses}
            defaultResources={metadata?.resources}
          />
          <MetadataFormStepAdditional
            forStep={6}
            currentStep={currentStep}
            defaultLegalBasisText={metadata?.legalbasisText}
          />
          <MetadataFormBottomNavigation
            reportValidity={reportValidity}
            currentStep={currentStep}
            setCurrentStep={setStepAndFocusFirstVisibleInput}
            submitButtonTitle={
              editMode
                ? t("metadataform.navigation.submit.edit")
                : t("metadataform.navigation.submit.create")
            }
          />
        </div>
      </form>
    </div>
  );
}
