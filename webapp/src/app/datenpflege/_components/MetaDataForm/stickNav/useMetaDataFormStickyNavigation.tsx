import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

type useMetaDataFormStickyNavigation = {
  index: number;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  checkValidityOfStep: (step: number) => boolean;
  editMode?: boolean;
};

export function useMetaDataFormStickyNavigation({
  index,
  setCurrentStep,
  currentStep,
  checkValidityOfStep,
  editMode,
}: useMetaDataFormStickyNavigation) {
  const initialActive = editMode ? index === 7 : index === 0;
  const [isActive, setIsActive] = useState<boolean>(initialActive);
  const [notVisited, setNotVisited] = useState<boolean>(
    editMode ? false : !initialActive,
  );
  const [hasError, setHasError] = useState<boolean>(false);

  const onClick = () => {
    if (!isActive) {
      setCurrentStep(index);
    }
  };

  const checkValidityOfCurrentStep = useCallback(() => {
    if (checkValidityOfStep(index)) {
      setHasError(false);
    } else {
      setHasError(true);
    }
  }, [checkValidityOfStep, index]);

  const liClass = [];
  isActive && liClass.push("active");
  !notVisited && !isActive && liClass.push("done");
  hasError && liClass.push("error");

  // effect for switching active and done items
  useEffect(() => {
    if (index === currentStep) {
      setIsActive(true);
      setNotVisited(false);
    } else {
      setIsActive(false);
    }
  }, [currentStep, index]);

  // effect to trigger validation on moving out of a current active step
  useEffect(() => {
    if (isActive && index !== currentStep) {
      checkValidityOfCurrentStep();
    }
  }, [checkValidityOfCurrentStep, currentStep, index, isActive]);

  // effect to trigger validation once on init if we are in edit mode
  useEffect(() => {
    if (editMode) {
      checkValidityOfCurrentStep();
    }
  }, [checkValidityOfCurrentStep, editMode]);

  return {
    isActive,
    notVisited,
    hasError,
    onClick,
    listItemClasses: liClass.join(" "),
  };
}
