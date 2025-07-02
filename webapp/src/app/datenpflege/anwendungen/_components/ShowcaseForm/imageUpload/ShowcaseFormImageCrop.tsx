import React, { useCallback, useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";

import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { getCroppedImg } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/cropUtils";
import { SHOWCASE_FORM_INPUTS } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/showcase-formConstants";
import { i18n } from "@/i18n";

type CroppedArea = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type ShowcaseFormImageCrop = {
  imageSrc: string;
  onDeleteImage: () => void;
  imageOrderNumber: number;
};

export function ShowcaseFormImageCrop({
  imageSrc,
  onDeleteImage,
  imageOrderNumber,
}: ShowcaseFormImageCrop) {
  const [hasError, setHasError] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedArea | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const rangeInputRef = React.useRef<HTMLInputElement>(null);

  const cropImage = useCallback(
    async (cropArea: CroppedArea) => {
      setHasError(false);
      try {
        const croppedImage = await getCroppedImg(imageSrc, cropArea);
        setCroppedImage(croppedImage);
      } catch (e) {
        console.error(e);
        setHasError(true);
      }
    },
    [imageSrc],
  );

  // Function to crop the image on initial load to ensure full image is used
  useEffect(() => {
    if (!imageSrc) {
      return;
    }

    const cropInitialImage = async () => {
      // Temporarily create an image element to load and determine default crop area
      const img = new Image();

      img.onerror = () => {
        console.error("Failed to load image for initial cropping");
        setHasError(true);
      };

      img.onload = async () => {
        const defaultCropArea = {
          x: 0,
          y: 0,
          width: img.naturalWidth,
          height: img.naturalHeight,
        };

        cropImage(croppedAreaPixels || defaultCropArea);
      };
      img.src = imageSrc;
    };

    cropInitialImage();
  }, [imageSrc, croppedAreaPixels, cropImage]);

  const onCropComplete = useCallback(
    async (_croppedArea: Area, croppedAreaPixels: CroppedArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
      cropImage(croppedAreaPixels);
    },
    [cropImage],
  );

  const handleDeleteImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteImage();
  };

  return (
    <div className="image-crop">
      <div className="crop-container">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1 / 1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          showGrid={false}
          objectFit="contain"
          onMediaLoaded={() => {
            rangeInputRef.current?.focus();
          }}
        />
      </div>

      <div className="crop-controls d-flex flex-column align-items-center">
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-label={i18n.t("showcaseform.field.images.zoom.label")}
          onChange={(e) => {
            setZoom(Number(e.target.value));
          }}
          className="zoom-range"
          ref={rangeInputRef}
        />

        <input
          type="hidden"
          className="sr-only"
          name={`${SHOWCASE_FORM_INPUTS.IMAGE}${imageOrderNumber}`}
          value={croppedImage || ""}
        />

        <button className="gd-button gd-button-a" onClick={handleDeleteImage}>
          <SVG icon={icons.remove} size={"small"} />
          {i18n.t("showcaseform.field.images.upload.delete")}
        </button>
        {hasError && (
          <InfoBox
            variant="error"
            title={i18n.t("showcaseform.field.images.error.crop")}
            className="mt-2"
            data-testid="info-box"
          />
        )}
      </div>
    </div>
  );
}
