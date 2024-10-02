import { InputDate } from "@/app/_components/Inputs/InputDate";
import { FormRow } from "@/app/_components/Inputs/FormRow";
import { MetaDataFormStepContainer } from "@/app/datenpflege/metadaten/form/partials/MetaDataFormStepContainer";
import { METADATA_FORM_INPUTS } from "@/app/datenpflege/metadaten/form/formConstants";
import { i18n } from "@/i18n";

type MetadataFormStepTime = Omit<MetaDataFormStepContainer, "headline">;
export function MetadataFormStepTime({
  currentStep,
  forStep,
}: MetadataFormStepTime) {
  return (
    <MetaDataFormStepContainer
      currentStep={currentStep}
      forStep={forStep}
      headline={i18n.t("metadataform.step.time")}
    >
      <FormRow>
        <InputDate
          name={METADATA_FORM_INPUTS.TEMPORAL_COVERAGE_FROM}
          label={i18n.t("metadataform.field.temporal.from.label")}
          recommended
        />
        <InputDate
          name={METADATA_FORM_INPUTS.TEMPORAL_COVERAGE_UNTIL}
          label={i18n.t("metadataform.field.temporal.until.label")}
          recommended
        />
      </FormRow>
      <FormRow>
        <InputDate
          name={METADATA_FORM_INPUTS.DATES_PUBLISHED}
          label={i18n.t("metadataform.field.temporal.published.label")}
        />
      </FormRow>
      <FormRow>
        <InputDate
          name={METADATA_FORM_INPUTS.DATES_MODIFIED}
          label={i18n.t("metadataform.field.temporal.modified.label")}
        />
      </FormRow>
    </MetaDataFormStepContainer>
  );
}
