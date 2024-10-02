import { Dispatch, SetStateAction, useEffect, useState } from "react";

type useMetaDataFormStickyNavigation = {
  index: number;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  checkValidityOfStep: (step: number) => boolean;
};

export function useMetaDataFormStickyNavigation({
  index,
  setCurrentStep,
  currentStep,
  checkValidityOfStep,
}: useMetaDataFormStickyNavigation) {
  const initialActive = index === 0;
  const [isActive, setIsActive] = useState<boolean>(initialActive);
  const [notVisited, setNotVisited] = useState<boolean>(!initialActive);
  const [hasError, setHasError] = useState<boolean>(false);

  const onClick = () => {
    if (!isActive) {
      setCurrentStep(index);
    }
  };

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
      if (checkValidityOfStep(index)) {
        setHasError(false);
      } else {
        setHasError(true);
      }
    }
  }, [checkValidityOfStep, currentStep, index, isActive]);

  return {
    isActive,
    notVisited,
    hasError,
    onClick,
    listItemClasses: liClass.join(" "),
  };
}
