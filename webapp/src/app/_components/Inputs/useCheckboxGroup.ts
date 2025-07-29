import { ChangeEvent, useCallback, useEffect, useRef } from "react";

export function useCheckboxGroup(
  errorMessage: string,
  requiredItems: number,
  initialSelectedItems = 0,
) {
  const elementRef = useRef<HTMLInputElement>(null);
  const numberOfSelectedCheckBoxes = useRef(initialSelectedItems);

  // wrapped in useCallback() to isolate the reference to the current element
  // when used in an iteration
  const setCustomValidity = useCallback(() => {
    if (numberOfSelectedCheckBoxes.current >= requiredItems) {
      elementRef.current?.setCustomValidity("");
    } else {
      elementRef.current?.setCustomValidity(errorMessage);
    }
  }, [errorMessage, requiredItems]);

  const setElementRef = useCallback((node: HTMLInputElement | null) => {
    if (!elementRef.current) {
      elementRef.current = node;
    }
  }, []);

  useEffect(() => {
    setCustomValidity();
  });

  const onCheckboxChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      numberOfSelectedCheckBoxes.current += event.target.checked ? +1 : -1;
      setCustomValidity();
    },
    [setCustomValidity],
  );

  return {
    setElementRef,
    onCheckboxChange,
  };
}
