import { Dispatch, SetStateAction, useId } from "react";

import { METADATA_FORM_ID } from "@/app/datenpflege/_components/MetaDataForm/formConstants";
import { MetaDataFormNavigationError } from "@/app/datenpflege/_components/MetaDataForm/partials/MetaDataFormNavigationError";
import { generateStepContainerId } from "@/app/datenpflege/_components/MetaDataForm/partials/MetaDataFormStepContainer";
import { useMetaDataFormStickyNavigation } from "@/app/datenpflege/_components/MetaDataForm/stickNav/useMetaDataFormStickyNavigation";
import { i18n } from "@/i18n";

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
  const id = useId();

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
        // id here for making labels a11y compliant in small breakpoints.
        aria-labelledby={id}
        className="sticky-nav-button"
        type="button"
        onClick={onClick}
      >
        <span className="sticky-nav-button-text-container" id={id}>
          <span className="sticky-nav-button-text-container-stepName">
            {stepName}
          </span>

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
