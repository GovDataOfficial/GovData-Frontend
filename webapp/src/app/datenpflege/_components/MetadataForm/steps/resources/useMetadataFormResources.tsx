import { useCallback, useEffect, useRef, useState } from "react";

import { i18n } from "@/i18n";
import { MetadataResource } from "@/types/types";

export type MetadataRessourceFormInfo = {
  id: string;
  resource: MetadataResource | undefined;
  isDeleted: boolean;
};

type useMetadataFormResources = {
  defaultResources?: MetadataResource[];
};

const generateUniqueId = () => "id" + Math.random().toString(16).slice(2);

export function useMetadataFormResources({
  defaultResources,
}: useMetadataFormResources) {
  const [wasAdded, setWasAdded] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const setFirstInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      firstInputRef.current = node;
      if (wasAdded) {
        firstInputRef.current?.focus();
      }
    },
    [wasAdded],
  );

  const hasDefaultResources = defaultResources && defaultResources.length > 0;
  const [liveRegionMessage, setLiveRegionMessage] = useState<string>("");
  const [resources, setResources] = useState<MetadataRessourceFormInfo[]>(() =>
    hasDefaultResources
      ? defaultResources.map((resource) => ({
          id: generateUniqueId(),
          resource,
          isDeleted: false,
        }))
      : [
          {
            id: generateUniqueId(),
            resource: undefined,
            isDeleted: false,
          },
        ],
  );

  const addNewResource = () => {
    setResources((prevResources) => [
      ...prevResources,
      {
        id: generateUniqueId(),
        resource: undefined,
        isDeleted: false,
      },
    ]);
    setWasAdded(true);
    setLiveRegionMessage(i18n.t("metadataform.field.resource.added"));
  };

  const deleteResource = async (id: string, count: number) => {
    const resource = resources.find((resource) => resource.id === id);
    if (!resource) {
      return;
    }

    const userConfirmed = window.confirm(
      i18n.t("metadataform.field.resource.deleteConfirm", { count }),
    );

    if (userConfirmed) {
      setResources((prevResources) =>
        prevResources.map((resource) =>
          resource.id === id ? { ...resource, isDeleted: true } : resource,
        ),
      );
      setLiveRegionMessage(
        i18n.t("metadataform.field.resource.deleted", { count }),
      );
      setWasAdded(false);
      addButtonRef.current?.focus();
    }
  };

  const visibleResources = resources.filter((resource) => !resource.isDeleted);

  return {
    resources,
    addNewResource,
    deleteResource,
    liveRegionMessage,
    visibleResources,
    setFirstInputRef,
    addButtonRef,
  };
}
