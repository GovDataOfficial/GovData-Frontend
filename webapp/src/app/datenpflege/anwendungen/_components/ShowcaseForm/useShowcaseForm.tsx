import { FormEvent, RefObject } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "@/app/_components/Inputs/useForm";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";

type useShowcaseForm = {
  infoRef: RefObject<HTMLDivElement | null>;
  showcaseId?: number;
};

export enum ShowcaseRequestError {
  general = "general",
  dataDeleted = "dataDeleted",
}

export function useShowcaseForm({ showcaseId, infoRef }: useShowcaseForm) {
  const router = useRouter();

  const { setRequestError, requestError, releaseFormSubmit, formProps } =
    useForm<ShowcaseRequestError>({
      infoRef,
    });

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    releaseFormSubmit();
    e.preventDefault();
    setRequestError(undefined);

    const form = e.target as HTMLFormElement;

    const response = await fetch(form.action, {
      method: form.method,
      redirect: "follow",
      body: new FormData(form),
    });

    if (response.ok) {
      const redirectTo = showcaseId
        ? PAGES_AUTH.manage_showcases_form_edit_success
        : PAGES_AUTH.manage_showcases_form_add_success;
      router.push(redirectTo);
    } else {
      switch (response.status) {
        case 404:
          setRequestError(ShowcaseRequestError.dataDeleted);
          break;
        default:
          setRequestError(ShowcaseRequestError.general);
          break;
      }
    }
  };

  return {
    formProps: {
      ...formProps,
      onSubmit: handleFormSubmit,
      action: showcaseId
        ? `${API_ENDPOINTS.SHOWCASES.EDIT}/${showcaseId}`
        : API_ENDPOINTS.SHOWCASES.CREATE,
    },
    requestError,
  };
}
