import { FormRow } from "@/app/_components/Inputs/FormRow";
import { InputDate } from "@/app/_components/Inputs/InputDate";
import { METADATA_FORM_INPUTS } from "@/app/datenpflege/_components/MetaDataForm/formConstants";
import { MetaDataFormStepContainer } from "@/app/datenpflege/_components/MetaDataForm/partials/MetaDataFormStepContainer";
import { i18n } from "@/i18n";

type MetadataFormStepTime = Omit<MetaDataFormStepContainer, "headline"> & {
  defaultTemporalCoverageFrom?: string;
  defaultTemporalCoverageTo?: string;
  defaultLastModifiedDate?: string;
  defaultPublished?: string;
};
export function MetadataFormStepTime({
  currentStep,
  forStep,
  defaultTemporalCoverageFrom,
  defaultTemporalCoverageTo,
  defaultLastModifiedDate,
  defaultPublished,
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
          defaultValue={defaultTemporalCoverageFrom}
          recommended
        />
        <InputDate
          name={METADATA_FORM_INPUTS.TEMPORAL_COVERAGE_TO}
          label={i18n.t("metadataform.field.temporal.until.label")}
          defaultValue={defaultTemporalCoverageTo}
          recommended
        />
      </FormRow>
      <FormRow>
        <InputDate
          name={METADATA_FORM_INPUTS.PUBLISHED}
          label={i18n.t("metadataform.field.temporal.published.label")}
          defaultValue={defaultPublished}
        />
      </FormRow>
      <FormRow>
        <InputDate
          name={METADATA_FORM_INPUTS.LAST_MODIFIED_DATE}
          label={i18n.t("metadataform.field.temporal.lastModifiedDate.label")}
          defaultValue={defaultLastModifiedDate}
        />
      </FormRow>
    </MetaDataFormStepContainer>
  );
}
