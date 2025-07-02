import { RefObject, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type useForm = {
  infoRef: RefObject<HTMLDivElement>;
};

export function useForm<T extends string>({ infoRef }: useForm) {
  const [requestError, setRequestError] = useState<T | undefined>(undefined);

  const preventFormSubmit = () => {
    window.onbeforeunload = () => "string";
  };

  const releaseFormSubmit = () => {
    window.onbeforeunload = () => null;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    // Allow default behavior for textareas
    const target = event.target as HTMLElement;
    const tag = target.tagName.toLowerCase();
    if (tag === "textarea" || tag === "button") {
      return;
    }
    // Prevent submission for other input types
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (requestError && infoRef.current) {
      infoRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [infoRef, requestError]);

  return {
    formProps: {
      onChange: preventFormSubmit,
      onKeyDown: handleKeyDown,
      method: "POST",
    },
    releaseFormSubmit,
    setRequestError,
    requestError,
  };
}
