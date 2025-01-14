import { useState } from "react";

import { MetadataFormStepContainer } from "@/app/datenpflege/_components/MetadataForm/partials/MetadataFormStepContainer";
import { MetadataFormContactFormPart } from "@/app/datenpflege/_components/MetadataForm/steps/contacts/MetadataFormContactFormPart";
import { i18n } from "@/i18n";
import { Metadata, MetadataContact, MetadataContactRole } from "@/types/types";

const findContactByRole = (
  contacts: MetadataContact[] | undefined,
  role: MetadataContactRole,
) => {
  return contacts?.find((contact) => contact.role === role);
};

type MetadataFormStepContacts = Omit<MetadataFormStepContainer, "headline"> & {
  defaultContacts?: Metadata["contacts"];
};

export function MetadataFormStepContacts({
  currentStep,
  forStep,
  defaultContacts,
}: MetadataFormStepContacts) {
  const [liveRegionMessage, setLiveRegionMessage] = useState<string>("");

  const defaultPublisher = findContactByRole(
    defaultContacts,
    MetadataContactRole.publisher,
  );
  const defaultMaintainer = findContactByRole(
    defaultContacts,
    MetadataContactRole.maintainer,
  );
  const defaultCreator = findContactByRole(
    defaultContacts,
    MetadataContactRole.creator,
  );
  const defaultOriginator = findContactByRole(
    defaultContacts,
    MetadataContactRole.originator,
  );

  return (
    <MetadataFormStepContainer
      currentStep={currentStep}
      forStep={forStep}
      headline={i18n.t("metadataform.step.contacts")}
    >
      <MetadataFormContactFormPart
        type={MetadataContactRole.publisher}
        defaultContact={defaultPublisher}
        setLiveRegionMessage={setLiveRegionMessage}
      />
      <MetadataFormContactFormPart
        type={MetadataContactRole.maintainer}
        defaultContact={defaultMaintainer}
        setLiveRegionMessage={setLiveRegionMessage}
      />
      <MetadataFormContactFormPart
        type={MetadataContactRole.creator}
        defaultContact={defaultCreator}
        setLiveRegionMessage={setLiveRegionMessage}
      />
      <MetadataFormContactFormPart
        type={MetadataContactRole.originator}
        defaultContact={defaultOriginator}
        setLiveRegionMessage={setLiveRegionMessage}
      />
      <div aria-live="polite" className="sr-only">
        {liveRegionMessage}
      </div>
    </MetadataFormStepContainer>
  );
}
