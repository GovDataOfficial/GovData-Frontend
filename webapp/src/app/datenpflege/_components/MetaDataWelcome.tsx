import React from "react";

import { ExternalLink } from "@/app/_components/ExternalLink/ExternalLink";
import { i18n } from "@/i18n";

export function MetaDataWelcome() {
  const link = process.env.metadata_guide_link!;
  const { t } = i18n;
  return (
    <div>
      <p>{t("metadata.welcome.desc.1")}</p>
      <p>
        <strong>{t("metadata.welcome.desc.2")}</strong>
        <br />
        {t("metadata.welcome.desc.3")}
      </p>
      <ul>
        <li>
          <strong>{t("metadata.welcome.desc.4")}</strong>&nbsp;
          {t("metadata.welcome.desc.5")}
          <br />
          {t("metadata.welcome.desc.6")}&nbsp;
          <ExternalLink href={link} title={t("metadataform.help.guideLink")} />
          {t("metadata.welcome.desc.7")}&nbsp;
        </li>
        <li>
          <strong>{t("metadata.welcome.desc.8")}</strong>&nbsp;
          {t("metadata.welcome.desc.9")}
        </li>
      </ul>
    </div>
  );
}
