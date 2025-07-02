import React from "react";

import { Fieldset } from "@/app/_components/Inputs/Fieldset";
import { FormRow } from "@/app/_components/Inputs/FormRow";
import { InputEmail } from "@/app/_components/Inputs/InputEmail";
import { InputText } from "@/app/_components/Inputs/InputText";
import { InputUrl } from "@/app/_components/Inputs/InputUrl";
import { ShowcaseFormStepContainer } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/partials/ShowcaseFormStepContainer";
import {
  SHOWCASE_FORM_INPUTS,
  SHOWCASE_FORM_MAX_LENGTH_MEDIUM,
  SHOWCASE_FORM_MAX_LENGTH_SMALL,
  ShowcaseFormStepName,
} from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/showcase-formConstants";
import { i18n } from "@/i18n";
import { ShowcaseContact } from "@/types/types";

type ShowcaseFormStepContact = Omit<ShowcaseFormStepContainer, "name"> & {
  defaultContact?: ShowcaseContact;
};

export function ShowcaseFormStepContact({
  defaultContact,
}: ShowcaseFormStepContact) {
  return (
    <ShowcaseFormStepContainer name={ShowcaseFormStepName.contact}>
      <Fieldset
        legend={i18n.t(`showcaseform.fieldset.contact.label`)}
        className="contacts"
        id="showcase-contact"
      >
        <InputText
          name={SHOWCASE_FORM_INPUTS.CONTACT.name}
          label={i18n.t("showcaseform.field.contact.name.label")}
          defaultValue={defaultContact?.name}
          maxLength={SHOWCASE_FORM_MAX_LENGTH_MEDIUM}
        />
        <InputEmail
          name={SHOWCASE_FORM_INPUTS.CONTACT.email}
          label={i18n.t("showcaseform.field.contact.email.label")}
          defaultValue={defaultContact?.email}
          maxLength={SHOWCASE_FORM_MAX_LENGTH_MEDIUM}
        />
        <InputUrl
          name={SHOWCASE_FORM_INPUTS.CONTACT.website}
          label={i18n.t("showcaseform.field.contact.website.label")}
          defaultValue={defaultContact?.website}
          maxLength={SHOWCASE_FORM_MAX_LENGTH_MEDIUM}
        />
        <FormRow type="even">
          <InputText
            name={SHOWCASE_FORM_INPUTS.CONTACT.addressReceiver}
            label={i18n.t("showcaseform.field.contact.addressReceiver.label")}
            defaultValue={defaultContact?.addressReceiver}
            maxLength={SHOWCASE_FORM_MAX_LENGTH_SMALL}
          />
          <InputText
            name={SHOWCASE_FORM_INPUTS.CONTACT.addressExtras}
            label={i18n.t("showcaseform.field.contact.addressExtras.label")}
            defaultValue={defaultContact?.addressExtras}
            maxLength={SHOWCASE_FORM_MAX_LENGTH_SMALL}
          />
        </FormRow>
        <InputText
          name={SHOWCASE_FORM_INPUTS.CONTACT.addressStreet}
          label={i18n.t("showcaseform.field.contact.addressStreet.label")}
          defaultValue={defaultContact?.addressStreet}
          maxLength={SHOWCASE_FORM_MAX_LENGTH_SMALL}
        />
        <FormRow type={"1-2"}>
          <InputText
            name={SHOWCASE_FORM_INPUTS.CONTACT.addressPostalCode}
            label={i18n.t("showcaseform.field.contact.addressPostalCode.label")}
            defaultValue={defaultContact?.addressPostalCode}
            maxLength={SHOWCASE_FORM_MAX_LENGTH_SMALL}
          />
          <InputText
            name={SHOWCASE_FORM_INPUTS.CONTACT.addressCity}
            label={i18n.t("showcaseform.field.contact.addressCity.label")}
            defaultValue={defaultContact?.addressCity}
            maxLength={SHOWCASE_FORM_MAX_LENGTH_SMALL}
          />
        </FormRow>
        <InputText
          name={SHOWCASE_FORM_INPUTS.CONTACT.addressCountry}
          label={i18n.t("showcaseform.field.contact.addressCountry.label")}
          defaultValue={defaultContact?.addressCountry}
          maxLength={SHOWCASE_FORM_MAX_LENGTH_SMALL}
        />
      </Fieldset>
    </ShowcaseFormStepContainer>
  );
}
