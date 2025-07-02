import { useCallback, useEffect, useRef, useState } from "react";

import { processBase64ImageString } from "@/app/_lib/processBase64ImageString";
import { i18n } from "@/i18n";

export const useImageUpload = (initialImage: string | null = null) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);
  const [liveRegionMessage, setLiveRegionMessage] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string | null>((): string | null => {
    if (!initialImage) {
      return null;
    }
    // images loaded from the backend might or might not have a base64 prefix
    return processBase64ImageString(initialImage);
  });

  const uploadImage = async (file: File) => {
    try {
      const reader = new FileReader();

      // Create a promise wrapper around FileReader for better error handling
      const readFileAsync = new Promise<string | ArrayBuffer | null>(
        (resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => reject(new Error("Failed to read file"));
        },
      );

      reader.readAsDataURL(file);
      const result = await readFileAsync;
      if (!result) {
        throw new Error("Empty result from file reader");
      }

      // since we used readAsDataURL, the result is a base64 string
      setImageSrc(result as string);
      setIsDeleted(false);
      setLiveRegionMessage(i18n.t("showcaseform.field.images.added"));
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const focusUploadButton = useCallback(() => {
    if (uploadButtonRef.current) {
      uploadButtonRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!imageSrc && isDeleted) {
      focusUploadButton();
    }
  }, [imageSrc, focusUploadButton, isDeleted]);

  const deleteImage = () => {
    setImageSrc(null);
    setIsDeleted(true);
    setLiveRegionMessage(i18n.t("showcaseform.field.images.deleted"));
  };

  return {
    imageSrc,
    uploadImage,
    deleteImage,
    uploadButtonRef,
    liveRegionMessage,
  };
};
