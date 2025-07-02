import React from "react";

import { ShowcaseFormImageUpload } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/ShowcaseFormImageUpload";

import { ShowcaseFormImageCrop } from "./ShowcaseFormImageCrop";
import { useImageUpload } from "./useImageUpload";

export type ShowcaseFormImageUploadAndCropProps = {
  defaultImage?: string;
  imageOrderNumber: number;
};

export function ShowcaseFormImageUploadAndCrop({
  defaultImage,
  imageOrderNumber,
}: ShowcaseFormImageUploadAndCropProps) {
  const {
    imageSrc,
    uploadImage,
    deleteImage,
    uploadButtonRef,
    liveRegionMessage,
  } = useImageUpload(defaultImage || null);

  return (
    <div className="image-upload-and-crop">
      {!imageSrc ? (
        <ShowcaseFormImageUpload
          onImageUpload={uploadImage}
          uploadButtonRef={uploadButtonRef}
        />
      ) : (
        <ShowcaseFormImageCrop
          imageSrc={imageSrc}
          onDeleteImage={deleteImage}
          imageOrderNumber={imageOrderNumber}
        />
      )}
      <div aria-live="polite" className="sr-only">
        {liveRegionMessage}
      </div>
    </div>
  );
}
