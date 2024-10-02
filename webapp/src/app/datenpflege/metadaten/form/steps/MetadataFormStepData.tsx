import { InputText } from "@/app/_components/Inputs/InputText";
import { MetaDataFormStepContainer } from "@/app/datenpflege/metadaten/form/partials/MetaDataFormStepContainer";
import { METADATA_FORM_INPUTS } from "@/app/datenpflege/metadaten/form/formConstants";
import { i18n } from "@/i18n";
import { FormRow } from "@/app/_components/Inputs/FormRow";

type MetadataFormStepData = Omit<MetaDataFormStepContainer, "headline">;

export function MetadataFormStepData({
  currentStep,
  forStep,
}: MetadataFormStepData) {
  return (
    <MetaDataFormStepContainer
      currentStep={currentStep}
      forStep={forStep}
      headline={i18n.t("metadataform.step.data")}
    >
      <InputText
        name={METADATA_FORM_INPUTS.DATA_ORG}
        label={i18n.t("metadataform.field.data_org.label")}
        required
      />
      <InputText
        name={METADATA_FORM_INPUTS.CONTRIBUTER_ID}
        label={i18n.t("metadataform.field.contributerId.label")}
        required
      />
    </MetaDataFormStepContainer>
  );
}
