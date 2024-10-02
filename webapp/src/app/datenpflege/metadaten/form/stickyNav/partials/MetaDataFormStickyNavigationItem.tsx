import { Dispatch, SetStateAction } from "react";
import { useMetaDataFormStickyNavigation } from "@/app/datenpflege/metadaten/form/stickyNav/useMetaDataFormStickyNavigation";
import { generateStepContainerId } from "@/app/datenpflege/metadaten/form/partials/MetaDataFormStepContainer";
import { METADATA_FORM_ID } from "@/app/datenpflege/metadaten/form/formConstants";
import { i18n } from "@/i18n";
import { MetaDataFormNavigationError } from "@/app/datenpflege/metadaten/form/partials/MetaDataFormNavigationError";

type MetaDataFormStickyNavigationItem = {
  stepName: string;
  index: number;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  checkValidityOfStep: (step: number) => boolean;
};

export function MetaDataFormStickyNavigationItem({
  stepName,
  index,
  setCurrentStep,
  currentStep,
  checkValidityOfStep,
}: MetaDataFormStickyNavigationItem) {
  const { notVisited, listItemClasses, hasError, onClick, isActive } =
    useMetaDataFormStickyNavigation({
      index,
      setCurrentStep,
      currentStep,
      checkValidityOfStep,
    });

  if (notVisited) {
    return (
      <li className="notVisited">
        <div className="sticky-nav-button">
          <span className="sticky-nav-button-text-container">{stepName}</span>
        </div>
      </li>
    );
  }

  return (
    <li className={listItemClasses}>
      <button
        aria-controls={
          index === 7 ? METADATA_FORM_ID : generateStepContainerId(index)
        }
        className="sticky-nav-button"
        type="button"
        onClick={onClick}
      >
        <span className="sticky-nav-button-text-container">
          <span>{stepName}</span>

          {isActive && (
            <span className="sr-only">
              {i18n.t("metadataform.stepInfo.active")}
            </span>
          )}

          {hasError && <MetaDataFormNavigationError step={index + 1} />}
        </span>
      </button>
    </li>
  );
}
