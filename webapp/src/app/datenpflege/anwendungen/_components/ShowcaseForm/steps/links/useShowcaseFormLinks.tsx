import { useCallback, useRef, useState } from "react";

import { MAX_SHOWCASE_LINKS_COUNT } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/showcase-formConstants";
import { i18n } from "@/i18n";

export type ShowcaseLinkData = {
  name?: string;
  url?: string;
};

export type ShowcaseLinkFormInfo = {
  id: string;
  isDeleted: boolean;
  link?: ShowcaseLinkData;
};

type useShowcaseFormLinks = {
  initialLinksCount: number;
  defaultLinks?: ShowcaseLinkData[];
  maxLinks?: number;
};

const generateUniqueId = () => "id" + Math.random().toString(16).slice(2);

export function useShowcaseFormLinks({
  defaultLinks,
  initialLinksCount,
  maxLinks,
}: useShowcaseFormLinks) {
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

  const hasDefaultLinks = defaultLinks && defaultLinks.length > 0;
  const [liveRegionMessage, setLiveRegionMessage] = useState<string>("");
  const [links, setLinks] = useState<ShowcaseLinkFormInfo[]>(() => {
    const max = Math.min(
      maxLinks ?? MAX_SHOWCASE_LINKS_COUNT,
      MAX_SHOWCASE_LINKS_COUNT,
    );
    const initialCount = Math.min(initialLinksCount, max);

    return hasDefaultLinks
      ? defaultLinks.map((link) => ({
          id: generateUniqueId(),
          link,
          isDeleted: false,
        }))
      : Array.from({ length: initialCount || 1 }, () => ({
          id: generateUniqueId(),
          link: undefined,
          isDeleted: false,
        }));
  });

  const addNewLink = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLinks((prevLinks) => [
      ...prevLinks,
      {
        id: generateUniqueId(),
        link: undefined,
        isDeleted: false,
      },
    ]);
    setWasAdded(true);
    setLiveRegionMessage(i18n.t("showcaseform.field.links.added"));
  };

  const deleteLink = async (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
    name?: string,
  ) => {
    event.preventDefault();
    const link = links.find((link) => link.id === id);
    if (!link) {
      return;
    }

    const userConfirmed = window.confirm(
      name
        ? i18n.t("showcaseform.field.links.deleteConfirm", { name })
        : i18n.t("showcaseform.field.links.deleteConfirm.noName"),
    );

    if (userConfirmed) {
      setLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.id === id ? { ...link, isDeleted: true } : link,
        ),
      );
      setLiveRegionMessage(
        name
          ? i18n.t("showcaseform.field.links.deleted", { name })
          : i18n.t("showcaseform.field.links.deleted.noName"),
      );
      setWasAdded(false);
      // focus button after DOM updates
      setTimeout(() => addButtonRef.current?.focus(), 0);
    }
  };

  const visibleLinks = links.filter((link) => !link.isDeleted);

  return {
    links,
    addNewLink,
    deleteLink,
    liveRegionMessage,
    visibleLinks,
    setFirstInputRef,
    addButtonRef,
  };
}
