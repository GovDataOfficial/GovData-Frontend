import React from "react";
import { Metadata } from "next";

import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { Trans } from "@/app/_components/Trans/Trans";
import { ContactForm } from "@/app/kontakt/ContactForm";
import { i18n } from "@/i18n";

export const metadata: Metadata = {
  title: i18n.t("meta.contact.title"),
};

export default function Page() {
  const mailto = `mailto:${process.env.mail_smtp_to_address}`;
  const { t } = i18n;
  const mail = <a href={mailto}>{t("contact.page.info.mailto")}</a>;

  return (
    <>
      <ContainerSection
        containerWidth="lg"
        headline={t("contact.page.title")}
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        <DesignBox>
          <Trans
            i18nKey={`contact.page.info.description`}
            params={{ portalName: t("portal.name"), mail, lineBreak: <br /> }}
          />
          {process.env.mail_enabled &&
            process.env.mail_enabled.toLowerCase() === "true" && (
              <ContactForm
                mailAdress={process.env.mail_smtp_to_address || ""}
              />
            )}
        </DesignBox>
      </ContainerSection>
    </>
  );
}
