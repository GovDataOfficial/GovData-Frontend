import React from "react";
import { Metadata } from "next";

import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { PAGES } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";

export const metadata: Metadata = {
  title: i18n.t("meta.contact.ok.title"),
};

export default async function Page() {
  return (
    <>
      <ContainerSection
        containerWidth="lg"
        headline={i18n.t("contact.page.title")}
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        <InfoBox
          className="mb-2"
          variant="success"
          title={i18n.t("contact.page.ok.title")}
        >
          {i18n.t("contact.page.ok.thanks")}
          <br />
          {i18n.t("contact.page.ok.check")}
        </InfoBox>
        <a href={PAGES.root}>{i18n.t("header.navigation.mainPage")}</a>
      </ContainerSection>
    </>
  );
}
