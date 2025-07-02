import { Button } from "@/app/_components/Button/Button";
import { Fieldset } from "@/app/_components/Inputs/Fieldset";
import { FormRow } from "@/app/_components/Inputs/FormRow";
import { InputEmail } from "@/app/_components/Inputs/InputEmail";
import { InputText } from "@/app/_components/Inputs/InputText";
import { InputUrl } from "@/app/_components/Inputs/InputUrl";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import {
  METADATA_FORM_INPUTS,
  METADATA_FORM_MAX_LENGTH_MEDIUM,
  METADATA_FORM_MAX_LENGTH_SMALL,
} from "@/app/datenpflege/metadaten/_components/MetadataForm/metadata-formConstants";
import { useMetadataFormContact } from "@/app/datenpflege/metadaten/_components/MetadataForm/steps/contacts/useMetadataFormContact";
import { i18n } from "@/i18n";
import { MetadataContact, MetadataContactRole } from "@/types/types";

export type MetadataFormContactFormPart = {
  type: MetadataContactRole;
  defaultContact?: MetadataContact;
  setLiveRegionMessage: (message: string) => void;
};

export function MetadataFormContactFormPart({
  type,
  defaultContact,
  setLiveRegionMessage,
}: MetadataFormContactFormPart) {
  const {
    contact,
    typeLowered,
    addContact,
    deleteContact,
    setFirstInputRef,
    setAddButtonRef,
  } = useMetadataFormContact({
    type,
    defaultContact,
    setLiveRegionMessage,
  });

  if (contact === undefined) {
    return (
      <div className="form-add-item-container">
        <h3>{i18n.t(`metadataform.fieldset.contacts.${typeLowered}.label`)}</h3>
        <Button
          id={`add-contact-button-${typeLowered}`}
          variant="secondary"
          onClick={() => addContact()}
          ref={setAddButtonRef}
        >
          <SVG icon={icons.plus} size="14" />
          <span className="ms-0_5">
            {`${i18n.t(`metadataform.fieldset.contacts.${typeLowered}.label`)} ${i18n.t("metadataform.fieldset.contacts.add")}`}
          </span>
        </Button>
      </div>
    );
  }

  const inputByType = METADATA_FORM_INPUTS.CONTACTS(type);
  return (
    <Fieldset
      legend={i18n.t(`metadataform.fieldset.contacts.${typeLowered}.label`)}
      className="contacts"
      id={`contact-${typeLowered}`}
    >
      <Button
        variant="secondary"
        onClick={() => {
          deleteContact();
        }}
        className="metadata-form-fieldset-legend-button"
      >
        <SVG icon={icons.trash} size="big" />
        <span className="ms-0_5">
          {`${i18n.t(`metadataform.fieldset.contacts.${typeLowered}.label`)} ${i18n.t("metadataform.fieldset.contacts.delete")}`}
        </span>
      </Button>
      <InputText
        name={inputByType.name}
        label={i18n.t("metadataform.field.contacts.name.label")}
        defaultValue={contact.name}
        recommended
        maxLength={METADATA_FORM_MAX_LENGTH_MEDIUM}
        ref={setFirstInputRef}
      />
      <InputEmail
        name={inputByType.email}
        label={i18n.t("metadataform.field.contacts.email.label")}
        defaultValue={contact.email}
        required
        maxLength={METADATA_FORM_MAX_LENGTH_MEDIUM}
      />
      <InputUrl
        name={inputByType.url}
        label={i18n.t("metadataform.field.contacts.url.label")}
        defaultValue={contact.url}
        recommended
        maxLength={METADATA_FORM_MAX_LENGTH_MEDIUM}
      />
      <FormRow type="even">
        <InputText
          name={inputByType.address.addressee}
          label={i18n.t("metadataform.field.contacts.addressee.label")}
          defaultValue={contact.address?.addressee}
          maxLength={METADATA_FORM_MAX_LENGTH_SMALL}
        />
        <InputText
          name={inputByType.address.details}
          label={i18n.t("metadataform.field.contacts.details.label")}
          defaultValue={contact.address?.details}
          maxLength={METADATA_FORM_MAX_LENGTH_SMALL}
        />
      </FormRow>
      <InputText
        name={inputByType.address.street}
        label={i18n.t("metadataform.field.contacts.street.label")}
        defaultValue={contact.address?.street}
        maxLength={METADATA_FORM_MAX_LENGTH_SMALL}
      />
      <FormRow type={"1-2"}>
        <InputText
          name={inputByType.address.zip}
          label={i18n.t("metadataform.field.contacts.zip.label")}
          defaultValue={contact.address?.zip}
          maxLength={METADATA_FORM_MAX_LENGTH_SMALL}
        />
        <InputText
          name={inputByType.address.country}
          label={i18n.t("metadataform.field.contacts.country.label")}
          defaultValue={contact.address?.country}
          maxLength={METADATA_FORM_MAX_LENGTH_SMALL}
        />
      </FormRow>
    </Fieldset>
  );
}
