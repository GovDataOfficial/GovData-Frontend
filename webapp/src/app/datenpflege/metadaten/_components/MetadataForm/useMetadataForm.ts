import { FormEvent, RefObject, useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "@/app/_components/Inputs/useForm";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";

export enum validationError {
  invalidTag = "error.invalidTag",
}

export enum MetadataRequestError {
  general = "general",
  duplicateTitle = "duplicateTitle",
  dataDeleted = "dataDeleted",
  validationError = "validationError",
  invalidTag = "invalidTag",
}

export interface DetailedErrorInfo {
  code: string;
}

const parseErrorResponse = async (
  response: Response,
): Promise<DetailedErrorInfo> => {
  try {
    const errorText = await response.text();
    try {
      const errorData = JSON.parse(errorText);
      return {
        code: errorData.code,
      };
    } catch {
      return {
        code: "",
      };
    }
  } catch {
    return {
      code: "",
    };
  }
};

type useMetadataForm = {
  editMode?: boolean;
  infoRef: RefObject<HTMLDivElement | null>;
};

export function useMetadataForm({ editMode, infoRef }: useMetadataForm) {
  const router = useRouter();

  const { setRequestError, requestError, releaseFormSubmit, formProps } =
    useForm<MetadataRequestError>({
      infoRef,
    });

  // State for detailed error information
  const [detailedErrorInfo, setDetailedErrorInfo] = useState<
    DetailedErrorInfo | undefined
  >(undefined);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    releaseFormSubmit();
    e.preventDefault();
    setRequestError(undefined);
    setDetailedErrorInfo(undefined);

    const form = e.target as HTMLFormElement;
    const response = await fetch(form.action, {
      method: form.method,
      redirect: "follow",
      body: new FormData(e.target as HTMLFormElement),
    });

    if (response.ok) {
      const redirectTo = editMode
        ? PAGES_AUTH.manage_metadata_form_edit_success
        : PAGES_AUTH.manage_metadata_form_add_success;
      router.push(redirectTo);
    } else {
      // Parse detailed error information
      const errorInfo = await parseErrorResponse(response);
      setDetailedErrorInfo(errorInfo);

      switch (response.status) {
        case 409:
          setRequestError(MetadataRequestError.duplicateTitle);
          break;
        case 404:
          setRequestError(MetadataRequestError.dataDeleted);
          break;
        case 400:
          if (errorInfo.code === validationError.invalidTag) {
            setRequestError(MetadataRequestError.invalidTag);
          } else {
            setRequestError(MetadataRequestError.validationError);
          }
          break;
        default:
          setRequestError(MetadataRequestError.general);
          break;
      }
    }
  };

  return {
    formProps: {
      ...formProps,
      onSubmit: handleFormSubmit,
      action: editMode
        ? API_ENDPOINTS.METADATA.EDIT
        : API_ENDPOINTS.METADATA.CREATE,
      method: "POST",
    },
    requestError,
    detailedErrorInfo,
  };
}
