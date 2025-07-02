import React from "react";

import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { i18n } from "@/i18n";

export function ShowcaseEditorError() {
  const { t } = i18n;
  return (
    <div className="mt-2">
      <InfoBox title={t("showcasesoverview.welcome.no_permission.title")}>
        {t("showcasesoverview.welcome.no_permission.desc.1")}
      </InfoBox>
    </div>
  );
}
