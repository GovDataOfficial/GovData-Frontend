import { i18n } from "@/i18n";

import { MetaDataFormStepContainer } from "@/app/datenpflege/_components/MetaDataForm/partials/MetaDataFormStepContainer";
import { MetaDataContactRole, MetaData, MetaDataContact } from "@/types/types";
import { MetadataFormContactFormPart } from "@/app/datenpflege/_components/MetaDataForm/steps/contacts/MetadataFormContactFormPart";
import { useState } from "react";

const findContactByRole = (
  contacts: MetaDataContact[] | undefined,
  role: MetaDataContactRole,
) => {
  return contacts?.find((contact) => contact.role === role);
};

type MetadataFormStepContacts = Omit<MetaDataFormStepContainer, "headline"> & {
  defaultContacts?: MetaData["contacts"];
};

export function MetadataFormStepContacts({
  currentStep,
  forStep,
  defaultContacts,
}: MetadataFormStepContacts) {
  const [liveRegionMessage, setLiveRegionMessage] = useState<string>("");

  const defaultPublisher = findContactByRole(
    defaultContacts,
    MetaDataContactRole.publisher,
  );
  const defaultMaintainer = findContactByRole(
    defaultContacts,
    MetaDataContactRole.maintainer,
  );
  const defaultCreator = findContactByRole(
    defaultContacts,
    MetaDataContactRole.creator,
  );
  const defaultOriginator = findContactByRole(
    defaultContacts,
    MetaDataContactRole.originator,
  );

  return (
    <MetaDataFormStepContainer
      currentStep={currentStep}
      forStep={forStep}
      headline={i18n.t("metadataform.step.contacts")}
    >
      <MetadataFormContactFormPart
        type={MetaDataContactRole.publisher}
        defaultContact={defaultPublisher}
        setLiveRegionMessage={setLiveRegionMessage}
      />
      <MetadataFormContactFormPart
        type={MetaDataContactRole.maintainer}
        defaultContact={defaultMaintainer}
        setLiveRegionMessage={setLiveRegionMessage}
      />
      <MetadataFormContactFormPart
        type={MetaDataContactRole.creator}
        defaultContact={defaultCreator}
        setLiveRegionMessage={setLiveRegionMessage}
      />
      <MetadataFormContactFormPart
        type={MetaDataContactRole.originator}
        defaultContact={defaultOriginator}
        setLiveRegionMessage={setLiveRegionMessage}
      />
      <div aria-live="polite" className="sr-only">
        {liveRegionMessage}
      </div>
    </MetaDataFormStepContainer>
  );
}
