import { InputTextMultiple } from "@/app/_components/Inputs/InputTextMultiple";
import {
  METADATA_FORM_INPUTS,
  METADATA_FORM_MAX_LENGTH_LONG,
} from "@/app/datenpflege/_components/MetadataForm/formConstants";
import { MetadataFormStepContainer } from "@/app/datenpflege/_components/MetadataForm/partials/MetadataFormStepContainer";
import { i18n } from "@/i18n";

type MetadataFormStepAdditional = Omit<
  MetadataFormStepContainer,
  "headline"
> & {
  defaultLegalBasisText?: string[];
};

export function MetadataFormStepAdditional({
  currentStep,
  forStep,
  defaultLegalBasisText,
}: MetadataFormStepAdditional) {
  return (
    <MetadataFormStepContainer
      currentStep={currentStep}
      forStep={forStep}
      headline={i18n.t("metadataform.step.additional")}
    >
      <InputTextMultiple
        name={METADATA_FORM_INPUTS.LEGAL_BASIS_TEXT}
        label={i18n.t("metadataform.field.legalBasisText.label")}
        examples={[
          "E-Government-Gesetz",
          "Umweltinformationsgesetz",
          "Nordrhein-Westfalen (UIG NRW)",
          "Public Sector Information Directive (PSI-Direktive)",
        ]}
        defaultValue={defaultLegalBasisText}
        maxLength={METADATA_FORM_MAX_LENGTH_LONG}
      />
    </MetadataFormStepContainer>
  );
}
