"use client";

import { useRef } from "react";

import { RequiredAsteriskInfo } from "@/app/_components/Inputs/partials/RequiredAsteriskInfo";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { Trans } from "@/app/_components/Trans/Trans";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import {
  METADATA_FORM_ID,
  METADATA_FORM_INPUTS,
} from "@/app/datenpflege/_components/MetaDataForm/formConstants";
import { MetadataFormHelpBox } from "@/app/datenpflege/_components/MetaDataForm/partials/MetadataFormHelpBox";
import { MetaDataFormRequestError } from "@/app/datenpflege/_components/MetaDataForm/partials/MetadataFormRequestError";
import { MetadataFormStepContacts } from "@/app/datenpflege/_components/MetaDataForm/steps/contacts/MetadataFormStepContacts";
import { MetadataFormStickyNavigation } from "@/app/datenpflege/_components/MetaDataForm/stickNav/MetadataFormStickyNavigation";
import { useMetadataForm } from "@/app/datenpflege/_components/MetaDataForm/useMetadataForm";
import { useMetadataFormNavigation } from "@/app/datenpflege/_components/MetaDataForm/useMetadataFormNavigation";
import { i18n } from "@/i18n";
import {
  CategoriesSorted,
  LicenseActiveSorted,
  MetaData,
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
  metaData?: MetaData;
  mailFitko: string;
  metadataGuideLink: string;
  metadataDcatapLink: string;
};

export function MetadataForm({
  categories,
  licenses,
  organizations,
  metaData,
  mailFitko,
  metadataGuideLink,
  metadataDcatapLink,
}: MetadataForm) {
  const editMode = !!metaData;
  const infoRef = useRef<HTMLDivElement>(null);

  const { requestError, formProps } = useMetadataForm({ editMode, infoRef });

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
    <div className="metadata-form-container">
      <div className="metadata-form-header-container">
        <div className="mb-2_5">
          <a href={PAGES_AUTH.manage_data}>
            <SVG icon={icons.arrowLeftLongBlue} size={"big"} />
            <span className="ms-1_5">
              {i18n.t("metadataform.navigation.myDatasets")}
            </span>
          </a>
        </div>
        <div ref={infoRef}>
          {isSummary && requestError && (
            <MetaDataFormRequestError
              requestError={requestError}
              mailFitko={mailFitko}
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
                  „{metaData?.title}”
                </strong>
              ),
            }}
            htmlElement="paragraph"
            className="paragraph-small"
          />
        )}
      </div>
      <div className="metadata-form-sticky-nav-container">
        <MetadataFormStickyNavigation
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          checkValidityOfStep={checkValidityOfStep}
          editMode={editMode}
        />
      </div>
      <form id={METADATA_FORM_ID} {...formProps}>
        <div className="metadata-form-step-container">
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

          {editMode && metaData && (
            <input
              type="hidden"
              name={METADATA_FORM_INPUTS.ID}
              value={metaData.id}
            />
          )}

          <MetadataFormStepData
            forStep={0}
            currentStep={currentStep}
            organizations={organizations}
            defaultOrgId={metaData?.owner_org}
            defaultContributerId={metaData?.contributorID}
          />
          <MetadataFormStepContents
            forStep={1}
            currentStep={currentStep}
            categories={categories}
            defaultDescription={metaData?.notes}
            defaultTitle={metaData?.title}
            defaultTags={metaData?.tags}
            defaultCategories={metaData?.categories}
            defaultHvdCategories={metaData?.hvdCategories}
            defaultWebsite={metaData?.url}
          />
          <MetadataFormStepContacts
            forStep={2}
            currentStep={currentStep}
            defaultContacts={metaData?.contacts}
          />
          <MetadataFormStepGeo
            forStep={3}
            currentStep={currentStep}
            defaultPoliciticalGeocodingLevelURI={
              metaData?.policiticalGeocodingLevelURI
            }
            defaultPoliciticalGeocodingURI={metaData?.politicalGeocodingURI}
            defaultGeocodingText={metaData?.geocodingText}
            defaultSpatial={metaData?.spatial}
          />
          <MetadataFormStepTime
            forStep={4}
            currentStep={currentStep}
            defaultTemporalCoverageFrom={metaData?.temporalCoverageFrom}
            defaultTemporalCoverageTo={metaData?.temporalCoverageTo}
            defaultLastModifiedDate={metaData?.lastModifiedDate}
            defaultPublished={metaData?.published}
          />
          <MetadataFormStepResources
            forStep={5}
            currentStep={currentStep}
            licenses={licenses}
            defaultResources={metaData?.resources}
          />
          <MetadataFormStepAdditional
            forStep={6}
            currentStep={currentStep}
            defaultLegalBasisText={metaData?.legalbasisText}
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
