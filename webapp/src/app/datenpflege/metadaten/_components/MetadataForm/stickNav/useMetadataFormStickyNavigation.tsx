import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

type useMetadataFormStickyNavigation = {
  index: number;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  checkValidityOfStep: (step: number) => boolean;
  editMode?: boolean;
};

type StepState = {
  visited: boolean;
  error: boolean;
};

type Action = { type: "VISIT" } | { type: "SET_ERROR"; error: boolean };

function stepReducer(state: StepState, action: Action): StepState {
  switch (action.type) {
    case "VISIT":
      // Only mark as visited once and keep it true
      return state.visited ? state : { ...state, visited: true };
    case "SET_ERROR":
      return { ...state, error: action.error };
    default:
      return state;
  }
}

export function useMetadataFormStickyNavigation({
  index,
  currentStep,
  setCurrentStep,
  checkValidityOfStep,
  editMode = false,
}: useMetadataFormStickyNavigation) {
  const isActive = currentStep === index;

  // Initial state: in edit mode all steps start as visited
  const [state, dispatch] = useReducer(stepReducer, {
    visited: editMode,
    error: false,
  });

  const notVisited = !state.visited;
  const hasError = state.error;

  const onClick = useCallback(() => {
    if (!isActive) {
      setCurrentStep(index);
    }
  }, [isActive, index, setCurrentStep]);

  const checkValidityOfCurrentStep = useCallback(() => {
    const valid = checkValidityOfStep(index);
    dispatch({ type: "SET_ERROR", error: !valid });
  }, [checkValidityOfStep, index]);

  // First time this step is entered → mark as visited
  useEffect(() => {
    if (isActive && !state.visited) {
      // queueMicrotask avoids warnings about updates during render
      queueMicrotask(() => dispatch({ type: "VISIT" }));
    }
  }, [isActive, state.visited]);

  // If the step was active and is now left → trigger validation
  const wasActiveRef = useRef(isActive);
  useEffect(() => {
    if (wasActiveRef.current && !isActive) {
      queueMicrotask(checkValidityOfCurrentStep);
    }
    wasActiveRef.current = isActive;
  }, [isActive, checkValidityOfCurrentStep]);

  // Edit mode: run an initial validation once
  useEffect(() => {
    if (editMode) {
      queueMicrotask(checkValidityOfCurrentStep);
    }
  }, [editMode, checkValidityOfCurrentStep]);

  // Combine classes based on logical state
  const listItemClasses = useMemo(() => {
    const classes: string[] = [];
    if (isActive) {
      classes.push("active");
    }
    if (!notVisited && !isActive) {
      classes.push("done");
    }
    if (hasError) {
      classes.push("error");
    }
    if (notVisited) {
      classes.push("notvisited");
    }
    return classes.join(" ");
  }, [isActive, notVisited, hasError]);

  return {
    isActive,
    notVisited,
    hasError,
    onClick,
    listItemClasses,
  };
}
