import { InputText } from "@/app/_components/Inputs/InputText";
import { TextArea } from "@/app/_components/Inputs/TextArea";
import { InputTextMultiple } from "@/app/_components/Inputs/InputTextMultiple";
import { MultiCheckBox } from "@/app/_components/Inputs/MultiCheckBox";
import React from "react";
import { CategoriesSorted } from "@/types/types";
import { defaultHvdCategoriesData } from "@/app/_lib/defaultFormData";
import { MetaDataFormStepContainer } from "@/app/datenpflege/metadaten/form/partials/MetaDataFormStepContainer";
import { METADATA_FORM_INPUTS } from "@/app/datenpflege/metadaten/form/formConstants";
import { i18n } from "@/i18n";

type MetadataFormStepContents = Omit<MetaDataFormStepContainer, "headline"> & {
  categories?: CategoriesSorted;
};

export function MetadataFormStepContents({
  categories,
  currentStep,
  forStep,
}: MetadataFormStepContents) {
  const categoriesMapped = categories?.map((category) => ({
    label: category.displayName,
    key: category.name,
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
        required
      />
      <TextArea
        name={METADATA_FORM_INPUTS.DESCRIPTION}
        label={i18n.t("metadataform.field.description.label")}
        required
      />
      <InputTextMultiple
        name={METADATA_FORM_INPUTS.TAGS}
        label={i18n.t("metadataform.field.tags.label")}
        examples={["opendata", "inspireidentifiziert", "hvd"]}
        recommended
      />
      <MultiCheckBox
        data={categoriesMapped}
        legend={i18n.t("metadataform.field.categories.label")}
        name={METADATA_FORM_INPUTS.CATEGORIES}
        recommended
      />
      <MultiCheckBox
        name={METADATA_FORM_INPUTS.HVD_CATEGORIES}
        data={defaultHvdCategoriesData}
        legend={i18n.t("metadataform.field.hvdCategories.label")}
      />
      <InputText
        name={METADATA_FORM_INPUTS.WEBSITE}
        label={i18n.t("metadataform.field.website.label")}
      />
    </MetaDataFormStepContainer>
  );
}
