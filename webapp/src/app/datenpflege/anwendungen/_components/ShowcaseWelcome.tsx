import React from "react";

import { i18n } from "@/i18n";

export function ShowcaseWelcome() {
  const { t } = i18n;
  return (
    <div>
      <p>{t("showcasesoverview.welcome.desc.1")}</p>
    </div>
  );
}
