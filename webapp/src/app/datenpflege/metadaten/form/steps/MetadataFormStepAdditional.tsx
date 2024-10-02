import { MetaDataFormStepContainer } from "@/app/datenpflege/metadaten/form/partials/MetaDataFormStepContainer";
import { InputTextMultiple } from "@/app/_components/Inputs/InputTextMultiple";
import { METADATA_FORM_INPUTS } from "@/app/datenpflege/metadaten/form/formConstants";
import { i18n } from "@/i18n";

type MetadataFormStepAdditional = Omit<MetaDataFormStepContainer, "headline">;

export function MetadataFormStepAdditional({
  currentStep,
  forStep,
}: MetadataFormStepAdditional) {
  return (
    <MetaDataFormStepContainer
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
      />
    </MetaDataFormStepContainer>
  );
}
