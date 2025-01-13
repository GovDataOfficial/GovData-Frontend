import React from "react";

import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { Trans } from "@/app/_components/Trans/Trans";
import { i18n } from "@/i18n";

export function MetaDataOrganizationError() {
  const { t } = i18n;
  const mailFitko = process.env.mail_fitko;
  const mail = <a href={`mailto:${mailFitko}`}>{mailFitko}</a>;
  const username = <strong>{t("username")}</strong>;
  return (
    <div className="mt-2">
      <InfoBox title={t("metadata.welcome.no_org.title")}>
        {t("metadata.welcome.no_org.desc.1")}
        <br />
        <Trans
          i18nKey="metadata.welcome.no_org.desc.2"
          params={{ mail, username }}
        />
      </InfoBox>
    </div>
  );
}
