import { InputText } from "@/app/_components/Inputs/InputText";
import { InputEmail } from "@/app/_components/Inputs/InputEmail";
import { Fieldset } from "@/app/_components/Inputs/Fieldset";
import { FormRow } from "@/app/_components/Inputs/FormRow";
import { MetaDataFormStepContainer } from "@/app/datenpflege/metadaten/form/partials/MetaDataFormStepContainer";
import {
  ContactType,
  METADATA_FORM_INPUTS,
} from "@/app/datenpflege/metadaten/form/formConstants";
import { i18n } from "@/i18n";

function ContactFormPart({ type }: { type: ContactType }) {
  const inputByType = METADATA_FORM_INPUTS.CONTACTS(type);
  return (
    <>
      <InputText
        name={inputByType.name}
        label={i18n.t("metadataform.field.contacts.name.label")}
        recommended
      />
      <InputEmail
        name={inputByType.email}
        label={i18n.t("metadataform.field.contacts.email.label")}
        recommended
      />
      <InputText
        name={inputByType.url}
        label={i18n.t("metadataform.field.contacts.url.label")}
        recommended
      />
      <FormRow type="even">
        <InputText
          name={inputByType.address.addressee}
          label={i18n.t("metadataform.field.contacts.addressee.label")}
        />
        <InputText
          name={inputByType.address.details}
          label={i18n.t("metadataform.field.contacts.details.label")}
        />
      </FormRow>
      <InputText
        name={inputByType.address.street}
        label={i18n.t("metadataform.field.contacts.street.label")}
      />
      <FormRow type={"1-2"}>
        <InputText
          name={inputByType.address.zip}
          label={i18n.t("metadataform.field.contacts.zip.label")}
        />
        <InputText
          name={inputByType.address.country}
          label={i18n.t("metadataform.field.contacts.country.label")}
        />
      </FormRow>
    </>
  );
}

type MetadataFormStepContacts = Omit<MetaDataFormStepContainer, "headline">;

export function MetadataFormStepContacts({
  currentStep,
  forStep,
}: MetadataFormStepContacts) {
  return (
    <MetaDataFormStepContainer
      currentStep={currentStep}
      forStep={forStep}
      headline={i18n.t("metadataform.step.contacts")}
    >
      <Fieldset
        borderBottom
        legend={i18n.t("metadataform.fieldset.contacts.publisher.label")}
      >
        <ContactFormPart type="publisher" />
      </Fieldset>
      <Fieldset
        borderBottom
        legend={i18n.t("metadataform.fieldset.contacts.maintainer.label")}
      >
        <ContactFormPart type="maintainer" />
      </Fieldset>
      <Fieldset
        borderBottom
        legend={i18n.t("metadataform.fieldset.contacts.author.label")}
      >
        <ContactFormPart type="author" />
      </Fieldset>
      <Fieldset
        legend={i18n.t("metadataform.fieldset.contacts.originator.label")}
      >
        <ContactFormPart type="originator" />
      </Fieldset>
    </MetaDataFormStepContainer>
  );
}
