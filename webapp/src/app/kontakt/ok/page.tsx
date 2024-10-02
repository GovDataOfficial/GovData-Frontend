import { Metadata } from "next";
import React from "react";
import { i18n } from "@/i18n";
import { PAGES } from "@/app/_lib/URLHelper";
import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { SuccessBox } from "@/app/_components/InfoBoxes/SuccessBox";

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
        <SuccessBox title={i18n.t("contact.page.ok.title")}>
          {i18n.t("contact.page.ok.thanks")}
          <br />
          {i18n.t("contact.page.ok.check")}
        </SuccessBox>
        <a href={PAGES.root}>{i18n.t("header.navigation.mainPage")}</a>
      </ContainerSection>
    </>
  );
}
