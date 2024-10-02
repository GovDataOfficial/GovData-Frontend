import { Metadata } from "next";
import { i18n } from "@/i18n";
import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import React from "react";
import { PAGES } from "@/app/_lib/URLHelper";
import { DesignBox } from "@/app/_components/DesignBox/DesignBox";

export const metadata: Metadata = {
  title: i18n.t("meta.metaDataForm.title"),
};

export default function Page() {
  return (
    <ContainerSection
      containerWidth="930"
      headline={i18n.t("metaDataForm.page.title")}
      centerHeadline
      modifier={[ContainerWrapperModifier.MARGIN_TOP]}
    >
      <DesignBox>
        <p className="m-0">
          Wir erneuern unser Portal, deshalb steht das Metadatenformular
          momentan nicht zur Verfügung.
        </p>
        <p className="m-0">
          Wenn in der Zwischenzeit Daten bereitgestellt werden sollen, kann man
          über das&nbsp;
          <a href={PAGES.contact}>Kontaktformular</a> mit uns in Verbindung
          treten.
        </p>
      </DesignBox>
    </ContainerSection>
  );
}
