import { FormEvent, RefObject, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";

type useMetadataForm = {
  editMode?: boolean;
  infoRef: RefObject<HTMLDivElement>;
};

export enum RequestError {
  general = "general",
  duplicateTitle = "duplicateTitle",
  dataDeleted = "dataDeleted",
}

export function useMetadataForm({ editMode, infoRef }: useMetadataForm) {
  const router = useRouter();

  const [requestError, setRequestError] = useState<RequestError | undefined>(
    undefined,
  );

  const preventFormSubmit = () => {
    window.onbeforeunload = () => "string";
  };

  const releaseFormSubmit = () => {
    window.onbeforeunload = () => null;
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    releaseFormSubmit();
    e.preventDefault();
    setRequestError(undefined);

    const form = e.target as HTMLFormElement;
    const response = await fetch(form.action, {
      method: form.method,
      redirect: "follow",
      body: new FormData(e.target as HTMLFormElement),
    });

    if (response.ok) {
      const redirectTo = editMode
        ? PAGES_AUTH.manage_data_form_edit_success
        : PAGES_AUTH.manage_data_form_add_success;
      router.push(redirectTo);
    } else {
      switch (response.status) {
        case 409:
          setRequestError(RequestError.duplicateTitle);
          break;
        case 404:
          setRequestError(RequestError.dataDeleted);
          break;
        default:
          setRequestError(RequestError.general);
          break;
      }
    }
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
      onSubmit: handleFormSubmit,
      onKeyDown: handleKeyDown,
      action: editMode
        ? API_ENDPOINTS.METADATA.EDIT
        : API_ENDPOINTS.METADATA.CREATE,
      method: "POST",
    },
    requestError,
  };
}
