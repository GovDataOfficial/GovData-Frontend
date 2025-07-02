import { ShowcaseFormImageUploadAndCrop } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/ShowcaseFormImageUploadAndCrop";
import { i18n } from "@/i18n";
import { ShowcaseImage } from "@/types/types";

const MAX_IMAGES = 4;

export type ShowcaseFormImagesComponent = {
  defaultImages?: ShowcaseImage[];
};

export function ShowcaseFormImagesComponent({
  defaultImages,
}: ShowcaseFormImagesComponent) {
  return (
    <div className="gd-input">
      <div className="mb-1">
        <strong>{i18n.t("showcaseform.field.images.label")}</strong>
      </div>
      <div className="form-image-upload-and-crop-component flex-column flex-md-row">
        {Array.from({ length: MAX_IMAGES }).map((_, index) => {
          let image: ShowcaseImage | undefined;

          if (defaultImages) {
            image = defaultImages.find((img) => img.imageOrderId === index + 1);
          }

          return (
            <ShowcaseFormImageUploadAndCrop
              key={index}
              defaultImage={image?.image}
              imageOrderNumber={image?.imageOrderId || index + 1}
            />
          );
        })}
      </div>
    </div>
  );
}
