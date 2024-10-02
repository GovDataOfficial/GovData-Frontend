import { InputText } from "@/app/_components/Inputs/InputText";
import { TextArea } from "@/app/_components/Inputs/TextArea";
import { InputCheckbox } from "@/app/_components/Inputs/InputCheckbox";
import { Fieldset } from "@/app/_components/Inputs/Fieldset";
import { InputTextMultiple } from "@/app/_components/Inputs/InputTextMultiple";
import { Select } from "@/app/_components/Inputs/Select";
import { LicenseActiveSorted } from "@/types/types";
import { InputDate } from "@/app/_components/Inputs/InputDate";
import { MetaDataFormStepContainer } from "@/app/datenpflege/metadaten/form/partials/MetaDataFormStepContainer";
import { METADATA_FORM_INPUTS } from "@/app/datenpflege/metadaten/form/formConstants";
import { defaultAvailability } from "@/app/_lib/defaultFormData";
import { i18n } from "@/i18n";

type MetadataFormStepResources = Omit<MetaDataFormStepContainer, "headline"> & {
  licenses?: LicenseActiveSorted;
};

type ResourceFormPart = {
  licenses: MetadataFormStepResources["licenses"];
  resourceNumber: number;
};

function ResourceFormPart({ licenses, resourceNumber }: ResourceFormPart) {
  const resourceInput = METADATA_FORM_INPUTS.RESSOURCE(resourceNumber);
  const isFirst = resourceNumber === 0;
  return (
    <>
      <InputText
        name={resourceInput.url}
        label={i18n.t("metadataform.field.resource.url.label")}
        required={isFirst}
      />
      <InputText
        name={resourceInput.name}
        label={i18n.t("metadataform.field.resource.name.label")}
      />
      <TextArea
        name={resourceInput.description}
        label={i18n.t("metadataform.field.resource.description.label")}
      />
      <InputText
        name={resourceInput.format}
        label={i18n.t("metadataform.field.resource.format.label")}
      />
      <InputTextMultiple
        name={resourceInput.language}
        label={i18n.t("metadataform.field.resource.language.label")}
        examples={["deutsch", "englisch", "französisch"]}
      />
      <Select
        label={i18n.t("metadataform.field.resource.license.label")}
        name={resourceInput.licenseId}
        required={isFirst}
        showNoValueOption
      >
        {licenses?.map((license) => (
          <option key={license.id} value={license.id}>
            {license.title}
          </option>
        ))}
      </Select>
      <InputText
        name={resourceInput.licenseAttributionByText}
        label={i18n.t(
          "metadataform.field.resource.licenseAttributionByText.label",
        )}
      />
      <InputDate
        name={resourceInput.modified}
        label={i18n.t("metadataform.field.resource.modified.label")}
      />

      <Select
        showNoValueOption
        label={i18n.t("metadataform.field.resource.availability.label")}
        name={resourceInput.availability}
        recommended
      >
        {defaultAvailability?.map((availability) => (
          <option key={availability.key} value={availability.key}>
            {availability.label}
          </option>
        ))}
      </Select>
      <InputCheckbox
        name={resourceInput.hvd}
        label={i18n.t("metadataform.field.resource.hvd.label")}
      />
    </>
  );
}

export function MetadataFormStepResources({
  licenses,
  forStep,
  currentStep,
}: MetadataFormStepResources) {
  return (
    <MetaDataFormStepContainer
      currentStep={currentStep}
      forStep={forStep}
      headline={i18n.t("metadataform.step.resources")}
    >
      <Fieldset
        borderBottom
        legend={i18n.t("metadataform.fieldset.resource.label", { count: 1 })}
      >
        <ResourceFormPart resourceNumber={0} licenses={licenses} />
      </Fieldset>
      <Fieldset
        borderBottom
        legend={i18n.t("metadataform.fieldset.resource.label", { count: 2 })}
      >
        <ResourceFormPart resourceNumber={1} licenses={licenses} />
      </Fieldset>
      <Fieldset
        legend={i18n.t("metadataform.fieldset.resource.label", { count: 3 })}
      >
        <ResourceFormPart resourceNumber={2} licenses={licenses} />
      </Fieldset>
    </MetaDataFormStepContainer>
  );
}
