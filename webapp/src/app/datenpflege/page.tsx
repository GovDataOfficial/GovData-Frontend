import { Metadata } from "next";
import { i18n } from "@/i18n";
import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import React from "react";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { ButtonLink } from "@/app/_components/Button/ButtonLink";
import { icons, SVG } from "@/app/_components/SVG/SVG";

export const metadata: Metadata = {
  title: i18n.t("meta.managedata.title"),
};

export default function Page() {
  return (
    <>
      <ContainerSection
        containerWidth="930"
        headline={"Herzlich Willkommen, ..."}
        centerHeadline
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        <p>
          Das hier ist der interne Bereich für das und das. Über den Button
          Metadatensatz hinzufügen öffnet sich das Formular, über das ein neuer
          Metadatensatz übermittelt werden kann.
        </p>
        <ButtonLink href={PAGES_AUTH.manage_data_form_add} variant="primary">
          <SVG icon={icons.plus} size="14" />
          <span className="ms-1">Metadatensatz erstellen</span>
        </ButtonLink>
      </ContainerSection>
    </>
  );
}
