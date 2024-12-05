import { i18n } from "@/i18n";
import { MetaDataContact, MetaDataContactRole } from "@/types/types";
import { useCallback, useEffect, useRef, useState } from "react";

const generateEmptyContact = (role: MetaDataContactRole): MetaDataContact => {
  return {
    role,
    name: "",
    email: "",
    url: "",
    address: {
      addressee: "",
      details: "",
      street: "",
      zip: "",
      country: "",
    },
  };
};

type useMetadataFormContact = {
  type: MetaDataContactRole;
  defaultContact?: MetaDataContact;
  setLiveRegionMessage: (message: string) => void;
};

export function useMetadataFormContact({
  type,
  defaultContact,
  setLiveRegionMessage,
}: useMetadataFormContact) {
  const typeLowered = type.toLocaleLowerCase();
  const translatedContact = i18n.t(
    `metadataform.fieldset.contacts.${typeLowered}.label`,
  );

  const [contact, setContact] = useState<MetaDataContact | undefined>(
    defaultContact,
  );

  const [wasEdited, setWasEdited] = useState<undefined | "deleted" | "added">(
    undefined,
  );

  const addButtonRef = useRef<HTMLButtonElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const setFirstInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      firstInputRef.current = node;
      if (wasEdited) {
        if (wasEdited === "added") {
          firstInputRef.current?.focus();
        }
      }
    },
    [wasEdited],
  );

  const setAddButtonRef = useCallback(
    (node: HTMLButtonElement | null) => {
      addButtonRef.current = node;
      if (wasEdited) {
        if (wasEdited === "deleted") {
          addButtonRef.current?.focus();
        }
      }
    },
    [wasEdited],
  );

  const addContact = () => {
    setContact(generateEmptyContact(type));
    setLiveRegionMessage(
      i18n.t("metadataform.fieldset.contacts.added", {
        contact: translatedContact,
      }),
    );
    setWasEdited("added");
  };

  const deleteContact = () => {
    const userConfirmed = window.confirm(
      i18n.t("metadataform.fieldset.contacts.deleteConfirm", {
        contact: translatedContact,
      }),
    );

    if (userConfirmed) {
      setContact(undefined);
      setLiveRegionMessage(
        i18n.t("metadataform.fieldset.contacts.deleted", {
          contact: translatedContact,
        }),
      );
      setWasEdited("deleted");
    }
  };

  useEffect(() => {
    if (wasEdited) {
      if (wasEdited === "deleted") {
        addButtonRef.current?.focus();
      }
      if (wasEdited === "added") {
        firstInputRef.current?.focus();
      }
    }
  }, [wasEdited]);

  return {
    contact,
    typeLowered,
    addContact,
    deleteContact,
    setFirstInputRef,
    setAddButtonRef,
  };
}
