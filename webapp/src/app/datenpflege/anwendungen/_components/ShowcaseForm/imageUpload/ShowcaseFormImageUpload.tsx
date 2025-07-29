import React, { useId } from "react";

import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { i18n } from "@/i18n";

export type ShowcaseFormImageUpload = {
  onImageUpload: (file: File) => void;
  uploadButtonRef: React.RefObject<HTMLButtonElement | null>;
};

export function ShowcaseFormImageUpload({
  onImageUpload,
  uploadButtonRef,
}: ShowcaseFormImageUpload) {
  const fileInputId = useId();
  const [hasError, setHasError] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHasError(false);
    try {
      const file = event.target.files?.[0];
      if (file) {
        await onImageUpload(file);
      }
    } catch (error) {
      console.error("Error handling file selection:", error);
      setHasError(true);
    }
  };

  return (
    <div>
      <div className="image-upload">
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="sr-only"
          ref={fileInputRef}
          tabIndex={-1}
          id={fileInputId}
        />
        <label htmlFor={fileInputId} className="">
          <button
            className="gd-button gd-button-a"
            aria-label={i18n.t("showcaseform.field.images.upload.label")}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                fileInputRef.current?.click();
              }
            }}
            ref={uploadButtonRef}
          >
            {i18n.t("showcaseform.field.images.upload.label")}
          </button>
        </label>
        <p>{i18n.t("showcaseform.field.images.upload.desc")}</p>
      </div>
      {hasError && (
        <InfoBox
          variant="error"
          title={i18n.t("showcaseform.field.images.error.imageUpload")}
          className="mt-2"
        />
      )}
    </div>
  );
}
