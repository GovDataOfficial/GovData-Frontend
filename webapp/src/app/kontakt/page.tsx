import { Metadata } from "next";
import React from "react";
import { ContactForm } from "@/app/kontakt/ContactForm";
import { i18n } from "@/i18n";
import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";

export const metadata: Metadata = {
  title: i18n.t("meta.contact.title"),
};

export default function Page() {
  const mailto = `mailto:${process.env.mail_smtp_to_address}`;
  const { t } = i18n;

  return (
    <>
      <ContainerSection
        containerWidth="lg"
        headline={t("contact.page.title")}
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        <DesignBox>
          {t("contact.page.info.description")}&nbsp;
          <a href={mailto}>{t("contact.page.info.mailto")}</a>
          {process.env.mail_enabled === "true" && <ContactForm />}
        </DesignBox>
      </ContainerSection>
    </>
  );
}
