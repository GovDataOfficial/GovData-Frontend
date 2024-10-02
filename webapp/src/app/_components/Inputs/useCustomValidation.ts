import { RefObject, useEffect } from "react";

export function useCustomValidation(ref: RefObject<any>, message?: string) {
  useEffect(() => {
    if (ref.current && message) {
      ref.current.addEventListener("invalid", () => {
        ref.current.setCustomValidity(message);

        ref.current.addEventListener(
          "change",
          () => {
            ref.current.setCustomValidity("");
          },
          { once: true },
        );
      });
    }
  }, [message, ref]);
}
