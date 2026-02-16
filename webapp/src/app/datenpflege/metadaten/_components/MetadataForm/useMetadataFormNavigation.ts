import { useCallback, useEffect, useState } from "react";

type useMetadataForm = {
  editMode?: boolean;
};

/**
 * Hook that stores state of current step and other utility functions for navigating the form.
 */
export function useMetadataFormNavigation({ editMode }: useMetadataForm) {
  const initialStep = editMode ? 7 : 0;
  const isBrowser = typeof document !== "undefined";

  const [currentStep, setCurrentStep] = useState(() => initialStep);
  const [updateFocus, updateFocusAfterNextClick] = useState<number>(0);

  const isSummary = currentStep === 7;

  const getVisibleStepContainer = useCallback(() => {
    if (!isBrowser) {
      return null;
    }
    return document.querySelector('.step-container[aria-hidden="false"]');
  }, [isBrowser]);

  const getStepContainer = useCallback(
    (step: number) => {
      if (!isBrowser) {
        return null;
      }
      return document.querySelector(`.step-container-${step}`);
    },
    [isBrowser],
  );

  // needs better logic to query fields
  const getAllFieldsInContainer = (container: Element | null) => {
    const inputs = container?.querySelectorAll("input, textarea, select");

    if (inputs) {
      return Array.from(inputs) as Array<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >;
    }
    return [];
  };

  const getVisibleInputs = () => {
    const container = getVisibleStepContainer();
    return getAllFieldsInContainer(container);
  };

  const checkValidityOfStep = useCallback(
    (step: number) => {
      if (!isBrowser) {
        return true;
      }
      const container = getStepContainer(step);
      const requiredInputs = getAllFieldsInContainer(container);

      const hasInvalidInput = requiredInputs.some((i) => !i.checkValidity());
      return !hasInvalidInput;
    },
    [isBrowser, getStepContainer],
  );

  const setStepAndFocusFirstVisibleInput = (step: number) => {
    setCurrentStep(step);
    updateFocusAfterNextClick((prevState) => prevState + 1);
  };

  const reportValidity = (): boolean => {
    if (!isBrowser) {
      return true;
    }
    const inputs = getVisibleInputs();
    // check validity for all so we can set gd-input-invalid on all inputs
    const invalidInputs = inputs.filter((input) => !input.checkValidity());

    invalidInputs.forEach(addInvalidClass);

    // if we have invalid inputs, we report the first one so focus is set
    if (invalidInputs.length > 0) {
      invalidInputs[0].reportValidity();
      return false;
    }

    return true;
  };

  const addInvalidClass = (
    input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  ) => {
    input.classList.add("gd-input-invalid");
    input.addEventListener("blur", () => {
      if (input.checkValidity()) {
        input.classList.remove("gd-input-invalid");
      }
    });
  };

  useEffect(() => {
    if (!isBrowser || updateFocus === 0) {
      return;
    }
    const stepContainer = getVisibleStepContainer();
    const fields = stepContainer?.querySelectorAll(
      "input, select",
    ) as NodeListOf<HTMLInputElement | HTMLSelectElement>;
    if (fields && fields.length > 0) {
      fields[0].focus();
    }
  }, [isBrowser, updateFocus, getVisibleStepContainer]);

  return {
    currentStep,
    setCurrentStep,
    setStepAndFocusFirstVisibleInput,
    reportValidity,
    isSummary,
    checkValidityOfStep,
  };
}
