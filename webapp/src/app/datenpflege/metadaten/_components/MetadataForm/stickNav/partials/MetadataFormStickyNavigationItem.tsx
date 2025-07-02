import { Dispatch, SetStateAction, useId } from "react";

import { METADATA_FORM_ID } from "@/app/datenpflege/metadaten/_components/MetadataForm/metadata-formConstants";
import { MetadataFormNavigationError } from "@/app/datenpflege/metadaten/_components/MetadataForm/partials/MetadataFormNavigationError";
import { generateStepContainerId } from "@/app/datenpflege/metadaten/_components/MetadataForm/partials/MetadataFormStepContainer";
import { useMetadataFormStickyNavigation } from "@/app/datenpflege/metadaten/_components/MetadataForm/stickNav/useMetadataFormStickyNavigation";
import { i18n } from "@/i18n";

type MetadataFormStickyNavigationItem = {
  stepName: string;
  index: number;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  checkValidityOfStep: (step: number) => boolean;
  editMode?: boolean;
};

export function MetadataFormStickyNavigationItem({
  stepName,
  index,
  setCurrentStep,
  currentStep,
  checkValidityOfStep,
  editMode,
}: MetadataFormStickyNavigationItem) {
  const id = useId();

  const { notVisited, listItemClasses, hasError, onClick, isActive } =
    useMetadataFormStickyNavigation({
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
          {hasError && <MetadataFormNavigationError step={index + 1} />}
        </span>
      </button>
    </li>
  );
}
