import { InputText } from "@/app/_components/Inputs/InputText";
import { TextArea } from "@/app/_components/Inputs/TextArea";
import { InputTextMultiple } from "@/app/_components/Inputs/InputTextMultiple";
import { MultiCheckBox } from "@/app/_components/Inputs/MultiCheckBox";
import React from "react";
import { CategoriesSorted, MetaData } from "@/types/types";
import { defaultHvdCategoriesData } from "@/app/_lib/defaultFormData";

import { i18n } from "@/i18n";
import { MetaDataFormStepContainer } from "@/app/datenpflege/_components/MetaDataForm/partials/MetaDataFormStepContainer";
import {
  METADATA_FORM_INPUTS,
  METADATA_FORM_MAX_LENGTH_LONG,
  METADATA_FORM_MAX_LENGTH_MEDIUM,
} from "@/app/datenpflege/_components/MetaDataForm/formConstants";
import { InputUrl } from "@/app/_components/Inputs/InputUrl";

type MetadataFormStepContents = Omit<MetaDataFormStepContainer, "headline"> & {
  categories?: CategoriesSorted;
  defaultTitle?: MetaData["notes"];
  defaultDescription?: string;
  defaultTags?: MetaData["tags"];
  defaultCategories?: MetaData["categories"];
  defaultHvdCategories?: MetaData["hvdCategories"];
  defaultWebsite?: string;
};

export function MetadataFormStepContents({
  categories,
  currentStep,
  forStep,
  defaultTitle,
  defaultDescription,
  defaultTags,
  defaultCategories,
  defaultHvdCategories,
  defaultWebsite,
}: MetadataFormStepContents) {
  const categoriesMapped = categories?.map((category) => ({
    label: category.displayName,
    key: category.name,
    defaultChecked: defaultCategories?.some(
      (defaultCategory) => defaultCategory.name === category.name,
    ),
  }));

  const hvdCategoriesMapped = defaultHvdCategoriesData.map((category) => ({
    label: category.label,
    key: category.key,
    defaultChecked: defaultHvdCategories?.some(
      (hvdCat) => hvdCat === category.shortkey,
    ),
  }));

  return (
    <MetaDataFormStepContainer
      currentStep={currentStep}
      forStep={forStep}
      headline={i18n.t("metadataform.step.contents")}
    >
      <InputText
        name={METADATA_FORM_INPUTS.TITLE}
        label={i18n.t("metadataform.field.title.label")}
        defaultValue={defaultTitle}
        maxLength={METADATA_FORM_MAX_LENGTH_MEDIUM}
        required
      />
      <TextArea
        name={METADATA_FORM_INPUTS.DESCRIPTION}
        label={i18n.t("metadataform.field.description.label")}
        defaultValue={defaultDescription}
        maxLength={METADATA_FORM_MAX_LENGTH_LONG}
        required
      />
      <InputTextMultiple
        name={METADATA_FORM_INPUTS.TAGS}
        label={i18n.t("metadataform.field.tags.label")}
        examples={["opendata", "inspireidentifiziert", "hvd"]}
        defaultValue={defaultTags?.map((tag) => tag.name)}
        recommended
        maxLength={METADATA_FORM_MAX_LENGTH_LONG}
      />
      <MultiCheckBox
        data={categoriesMapped}
        legend={i18n.t("metadataform.field.categories.label")}
        name={METADATA_FORM_INPUTS.CATEGORIES}
        recommended
      />
      <MultiCheckBox
        name={METADATA_FORM_INPUTS.HVD_CATEGORIES}
        data={hvdCategoriesMapped}
        legend={i18n.t("metadataform.field.hvdCategories.label")}
      />
      <InputUrl
        name={METADATA_FORM_INPUTS.URL}
        label={i18n.t("metadataform.field.url.label")}
        defaultValue={defaultWebsite}
        maxLength={METADATA_FORM_MAX_LENGTH_MEDIUM}
      />
    </MetaDataFormStepContainer>
  );
}
