import { RefObject, useEffect, useState } from "react";

/**
 * Hook that stores state of current step and other utility functions for navigating the form.
 * @param formRef
 */
export function useMetadataForm(formRef: RefObject<HTMLFormElement>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [updateFocus, updateFocusAfterNextClick] = useState<number>(0);
  const [showRecommendedInfo] = useState<boolean>();

  const isSummary = currentStep === 7;

  const getVisibleStepContainer = () => {
    return document.querySelector('.step-container[aria-hidden="false"]');
  };

  const getStepContainer = (step: number) => {
    return document.querySelector(`.step-container-${step}`);
  };

  // needs better logic to query fields
  const getRequiredInputs = (element: Element | null) => {
    const requiredInputs = element?.querySelectorAll(
      'input[required=""], textarea[required=""], select[required=""]',
    );
    return requiredInputs
      ? (Array.from(requiredInputs) as HTMLInputElement[])
      : [];
  };

  const getVisibleRequiredInputs = () => {
    const container = getVisibleStepContainer();
    return getRequiredInputs(container);
  };

  const checkValidityOfStep = (step: number) => {
    const container = getStepContainer(step);
    const requiredInputs = getRequiredInputs(container);

    const hasInvalidInput = requiredInputs.some((i) => !i.checkValidity());
    return !hasInvalidInput;
  };

  const preventFormSubmit = () => {
    window.onbeforeunload = () => "string";
  };

  const releaseFormSubmit = () => {
    window.onbeforeunload = () => null;
  };

  const setStepAndFocusFirstVisibleInput = (step: number) => {
    setCurrentStep(step);
    updateFocusAfterNextClick((prevState) => prevState + 1);
  };

  const reportValidity = (): boolean => {
    const requiredInputs = getVisibleRequiredInputs();
    // check validity for all so we can set gd-input-invalid on all inputs
    const invalidInputs = requiredInputs.filter(
      (input) => !input.checkValidity(),
    );

    invalidInputs.forEach(addInvalidClass);

    // if we have invalid inputs, we report the first one so focus is set
    if (invalidInputs.length > 0) {
      invalidInputs[0].reportValidity();
      return false;
    }

    return true;
  };

  const addInvalidClass = (input: HTMLInputElement) => {
    input.classList.add("gd-input-invalid");
    input.addEventListener("blur", (e) => {
      if (input.checkValidity()) {
        input.classList.remove("gd-input-invalid");
      }
    });
  };

  useEffect(() => {
    if (updateFocus !== 0) {
      const stepContainer = getVisibleStepContainer();
      const fields = stepContainer?.querySelectorAll(
        "input, select",
      ) as NodeListOf<HTMLInputElement | HTMLSelectElement>;
      if (fields && fields.length > 0) {
        fields[0].focus();
      }
    }
  }, [updateFocus]);

  return {
    currentStep,
    setCurrentStep,
    preventFormSubmit,
    releaseFormSubmit,
    setStepAndFocusFirstVisibleInput,
    reportValidity,
    showRecommendedInfo,
    isSummary,
    checkValidityOfStep,
  };
}
