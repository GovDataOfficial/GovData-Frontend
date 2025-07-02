import React from "react";

import { GeolocationCodeExample } from "@/app/_components/GeolocationCodeExample/GeoloctionCodeExample";
import { InputDate } from "@/app/_components/Inputs/InputDate";
import { InputText } from "@/app/_components/Inputs/InputText";
import { InputTextMultiple } from "@/app/_components/Inputs/InputTextMultiple";
import { MultiCheckBox } from "@/app/_components/Inputs/MultiCheckBox";
import { SpatialTextArea } from "@/app/_components/Inputs/SpatialTextArea";
import { TextArea } from "@/app/_components/Inputs/TextArea";
import {
  defaultPlatformData,
  defaultShowcaseTypeData,
} from "@/app/_lib/defaultFormData";
import { ShowcaseFormImagesComponent } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/ShowcaseFormImagesComponent";
import { ShowcaseFormStepContainer } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/partials/ShowcaseFormStepContainer";
import {
  SHOWCASE_FORM_INPUTS,
  SHOWCASE_FORM_MAX_LENGTH_LONG,
  SHOWCASE_FORM_MAX_LENGTH_SMALL,
  ShowcaseFormStepName,
} from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/showcase-formConstants";
import { i18n } from "@/i18n";
import { CategoriesSorted, ShowcaseData, ShowcaseImage } from "@/types/types";

const convertToDateString = (date?: number) => {
  return date ? new Date(date).toISOString() : undefined;
};

type ShowcaseFormStepContents = Omit<ShowcaseFormStepContainer, "name"> & {
  categories?: CategoriesSorted;
  defaultTitle?: string;
  defaultNotes?: string;
  defaultShowcaseTypes?: ShowcaseData["showcaseTypes"];
  defaultPlatforms?: ShowcaseData["platforms"];
  defaultCategories?: ShowcaseData["categories"];
  defaultKeywords?: ShowcaseData["keywords"];
  defaultManualShowcaseCreatedDate?: number;
  defaultManualShowcaseModifiedDate?: number;
  defaultSpatial?: string;
  defaultImages?: ShowcaseImage[];
};

export function ShowcaseFormStepContents({
  categories,
  defaultTitle,
  defaultNotes,
  defaultShowcaseTypes,
  defaultPlatforms,
  defaultCategories,
  defaultKeywords,
  defaultManualShowcaseCreatedDate,
  defaultManualShowcaseModifiedDate,
  defaultSpatial,
  defaultImages,
}: ShowcaseFormStepContents) {
  const categoriesMapped = categories?.map((category) => ({
    label: category.displayName,
    key: category.name,
    defaultChecked: defaultCategories?.some(
      (defaultCategory) => defaultCategory === category.name,
    ),
  }));

  const platformsMapped = defaultPlatformData.map((platform) => ({
    label: platform.label,
    key: platform.key,
    defaultChecked: defaultPlatforms?.some(
      (defaultPlatform) => defaultPlatform === platform.key,
    ),
  }));

  const showcaseTypesMapped = defaultShowcaseTypeData.map((showcaseType) => ({
    label: showcaseType.label,
    key: showcaseType.key,
    defaultChecked: defaultShowcaseTypes?.some(
      (defaultShowcaseType) => defaultShowcaseType === showcaseType.key,
    ),
  }));

  return (
    <ShowcaseFormStepContainer name={ShowcaseFormStepName.cotents}>
      <InputText
        name={SHOWCASE_FORM_INPUTS.TITLE}
        label={i18n.t("showcaseform.field.title.label")}
        defaultValue={defaultTitle}
        maxLength={SHOWCASE_FORM_MAX_LENGTH_SMALL}
        required
      />
      <TextArea
        name={SHOWCASE_FORM_INPUTS.NOTES}
        label={i18n.t("showcaseform.field.notes.label")}
        defaultValue={defaultNotes}
        maxLength={SHOWCASE_FORM_MAX_LENGTH_LONG}
        required
      />
      <MultiCheckBox
        name={SHOWCASE_FORM_INPUTS.SHOWCASE_TYPES}
        data={showcaseTypesMapped}
        legend={i18n.t("showcaseform.field.showcaseTypes.label")}
        required
      />
      <ShowcaseFormImagesComponent defaultImages={defaultImages} />
      <MultiCheckBox
        name={SHOWCASE_FORM_INPUTS.PLATFORMS}
        data={platformsMapped}
        legend={i18n.t("showcaseform.field.platforms.label")}
      />
      <InputTextMultiple
        name={SHOWCASE_FORM_INPUTS.KEYWORDS}
        label={i18n.t("showcaseform.field.keywords.label")}
        defaultValue={defaultKeywords}
        recommended
        maxLength={SHOWCASE_FORM_MAX_LENGTH_LONG}
        examples={["Wasserqualität", "Trinkwasser", "Parkleitsystem"]}
      />
      <MultiCheckBox
        data={categoriesMapped}
        legend={i18n.t("showcaseform.field.categories.label")}
        name={SHOWCASE_FORM_INPUTS.CATEGORIES}
        recommended
      />
      <div className="w-50">
        <div className="d-flex">
          <InputDate
            className="flex-grow-1 pe-4"
            name={SHOWCASE_FORM_INPUTS.CREATED_DATE}
            label={i18n.t("showcaseform.field.manualCreatedDate")}
            defaultValue={convertToDateString(defaultManualShowcaseCreatedDate)}
          />
          <InputDate
            className="flex-grow-1 pe-2"
            name={SHOWCASE_FORM_INPUTS.MODIFIED_DATE}
            label={i18n.t("showcaseform.field.manualModifiedDate")}
            defaultValue={convertToDateString(
              defaultManualShowcaseModifiedDate,
            )}
          />
        </div>
      </div>
      <div className="form-geolocation">
        <SpatialTextArea
          name={SHOWCASE_FORM_INPUTS.SPATIAL}
          label={i18n.t("metadataform.field.spatial.label")}
          defaultValue={defaultSpatial}
          recommended
          maxLength={SHOWCASE_FORM_MAX_LENGTH_LONG}
        />
        <GeolocationCodeExample />
      </div>
    </ShowcaseFormStepContainer>
  );
}
