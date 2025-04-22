import React from "react";
import { Metadata } from "next";

import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { ContactForm } from "@/app/kontakt/ContactForm";
import { i18n } from "@/i18n";

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
          {process.env.mail_enabled &&
            process.env.mail_enabled.toLowerCase() === "true" && (
              <ContactForm />
            )}
        </DesignBox>
      </ContainerSection>
    </>
  );
}
