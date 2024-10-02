"use client";
import { useRef } from "react";
import { MetadataFormStepData } from "./steps/MetadataFormStepData";
import { MetadataFormStepContents } from "./steps/MetadataFormStepContents";
import { MetadataFormStepGeo } from "./steps/MetadataFormStepGeo";
import { MetadataFormStepTime } from "./steps/MetadataFormStepTime";
import { MetadataFormStepResources } from "./steps/MetadataFormStepResources";
import { MetadataFormStepAdditional } from "./steps/MetadataFormStepAdditional";
import { MetadataFormBottomNavigation } from "./partials/MetadataFormBottomNavigation";
import { CategoriesSorted, LicenseActiveSorted } from "@/types/types";
import { MetaDataFormRecommendedInfoBox } from "./partials/MetaDataFormRecommendedInfoBox";
import { useMetadataForm } from "@/app/datenpflege/metadaten/form/useMetadataForm";
import { RequiredAsteriskInfo } from "@/app/_components/Inputs/partials/RequiredAsteriskInfo";
import { MetadataFormStepContacts } from "@/app/datenpflege/metadaten/form/steps/MetadataFormStepContacts";
import { i18n } from "@/i18n";
import { MetadataFormStickyNavigation } from "@/app/datenpflege/metadaten/form/stickyNav/MetadataFormStickyNavigation";
import { METADATA_FORM_ID } from "@/app/datenpflege/metadaten/form/formConstants";

type MetadataForm = {
  categories?: CategoriesSorted;
  licenses?: LicenseActiveSorted;
};

export function MetadataForm({ categories, licenses }: MetadataForm) {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    preventFormSubmit,
    releaseFormSubmit,
    setStepAndFocusFirstVisibleInput,
    currentStep,
    setCurrentStep,
    showRecommendedInfo,
    reportValidity,
    isSummary,
    checkValidityOfStep,
  } = useMetadataForm(formRef);

  const showOn = (num: number) => ({ currentStep, forStep: num });

  return (
    <div className="row">
      <div className="d-none d-md-block col-md-3">
        <MetadataFormStickyNavigation
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          checkValidityOfStep={checkValidityOfStep}
        />
      </div>
      <div className="col">
        <h1 className="mt-0">{i18n.t("metadataform.create")}</h1>
        <div className="d-md-none">
          <MetadataFormStickyNavigation
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
            checkValidityOfStep={checkValidityOfStep}
            mobile
          />
        </div>
        <form
          action={"/api/datenpflege/metadaten/erstellen"}
          method={"POST"}
          onChange={() => {
            preventFormSubmit();
          }}
          id={METADATA_FORM_ID}
          ref={formRef}
          onSubmit={(e) => {
            releaseFormSubmit();
          }}
        >
          {showRecommendedInfo && <MetaDataFormRecommendedInfoBox />}

          {isSummary && (
            <>
              <h2 className="mb-1">{i18n.t("metadataform.step.summary")}</h2>
              <p className="mt-0">
                {i18n.t("metadataform.step.summary.description")}
              </p>
            </>
          )}

          <RequiredAsteriskInfo className="mb-5" />
          <MetadataFormStepData {...showOn(0)} />
          <MetadataFormStepContents {...showOn(1)} categories={categories} />
          <MetadataFormStepContacts {...showOn(2)} />
          <MetadataFormStepGeo {...showOn(3)} />
          <MetadataFormStepTime {...showOn(4)} />
          <MetadataFormStepResources {...showOn(5)} licenses={licenses} />
          <MetadataFormStepAdditional {...showOn(6)} />
          <MetadataFormBottomNavigation
            reportValidity={reportValidity}
            currentStep={currentStep}
            setCurrentStep={setStepAndFocusFirstVisibleInput}
          />
        </form>
      </div>
    </div>
  );
}
