import { Dispatch, SetStateAction } from "react";

import { i18n } from "@/i18n";
import { useMetaDataFormStickyNavigation } from "@/app/datenpflege/_components/MetaDataForm/stickNav/useMetaDataFormStickyNavigation";
import { METADATA_FORM_ID } from "@/app/datenpflege/_components/MetaDataForm/formConstants";
import { generateStepContainerId } from "@/app/datenpflege/_components/MetaDataForm/partials/MetaDataFormStepContainer";
import { MetaDataFormNavigationError } from "@/app/datenpflege/_components/MetaDataForm/partials/MetaDataFormNavigationError";

type MetaDataFormStickyNavigationItem = {
  stepName: string;
  index: number;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  checkValidityOfStep: (step: number) => boolean;
  editMode?: boolean;
};

export function MetaDataFormStickyNavigationItem({
  stepName,
  index,
  setCurrentStep,
  currentStep,
  checkValidityOfStep,
  editMode,
}: MetaDataFormStickyNavigationItem) {
  const { notVisited, listItemClasses, hasError, onClick, isActive } =
    useMetaDataFormStickyNavigation({
      index,
      setCurrentStep,
      currentStep,
      checkValidityOfStep,
      editMode,
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
