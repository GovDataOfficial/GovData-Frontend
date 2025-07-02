import { ChangeEvent, useCallback, useEffect, useRef } from "react";
import { valid } from "geojson-validation";

import { i18n } from "@/i18n";

export function useSpatialValidation() {
  const elementRef = useRef<HTMLTextAreaElement | null>();
  const errorMessage = i18n.t("form.field.spatial.error");

  // wrapped in useCallback() to isolate the reference to the current element
  // when used in an iteration
  const setCustomValidity = useCallback(() => {
    try {
      const inputValue = elementRef.current?.value.trim() || "";

      if (!inputValue) {
        elementRef.current?.setCustomValidity("");
        return;
      }

      const parsedInput = JSON.parse(inputValue);

      if (valid(parsedInput)) {
        elementRef.current?.setCustomValidity("");
      } else {
        elementRef.current?.setCustomValidity(errorMessage);
      }
    } catch (error) {
      elementRef.current?.setCustomValidity(errorMessage);
    }
  }, [errorMessage]);

  const setElementRef = useCallback((node: HTMLTextAreaElement | null) => {
    if (!elementRef.current) {
      elementRef.current = node;
    }
  }, []);

  useEffect(() => {
    setCustomValidity();
  });

  const onTextareaChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setCustomValidity();
    },
    [setCustomValidity],
  );

  return {
    setElementRef,
    onTextareaChange,
  };
}
