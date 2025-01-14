import React from "react";

import { Button } from "@/app/_components/Button/Button";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";

type MetadataFormBottomNavigation = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  reportValidity: () => boolean;
  submitButtonTitle: string;
};

export function MetadataFormBottomNavigation({
  currentStep,
  setCurrentStep,
  reportValidity,
  submitButtonTitle,
}: MetadataFormBottomNavigation) {
  const showBackButton = currentStep !== 0;
  const isLastStep = currentStep === 7;

  return (
    <div className="metadata-form-bottom-navigation">
      <a href={PAGES_AUTH.manage_data} className="align-content-center">
        {i18n.t("metadataform.navigation.cancel")}
      </a>
      <div className="d-flex">
        {showBackButton && (
          <Button
            id="metadata-form-back-button"
            variant="secondary"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="me-2"
          >
            <SVG icon={icons.arrowLeftLongBlue} size="big" />
            <span className="ms-0_5">
              {i18n.t("metadataform.navigation.back")}
            </span>
          </Button>
        )}

        {isLastStep ? (
          <Button
            id="metadata-form-submit-button"
            type="submit"
            variant="primary"
          >
            {submitButtonTitle}
          </Button>
        ) : (
          <Button
            id="metadata-form-continue-button"
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              if (reportValidity()) {
                setCurrentStep(currentStep + 1);
              }
            }}
          >
            <span className="me-0_5">
              {currentStep === 6
                ? i18n.t("metadataform.navigation.toSummary")
                : i18n.t("metadataform.navigation.forward")}
            </span>
            <SVG icon={icons.arrowRightLongWhite} size="big" />
          </Button>
        )}
      </div>
    </div>
  );
}
