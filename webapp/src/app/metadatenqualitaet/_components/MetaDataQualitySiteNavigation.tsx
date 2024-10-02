"use client";
import { SiteNavigation } from "@/app/_components/SiteNavBar/SiteNavigation";
import { metaDataQualityMenu } from "@/configuration/menuSettings";
import { i18n } from "@/i18n";

export function MetaDataQualitySiteNavigation() {
  return (
    <SiteNavigation
      items={metaDataQualityMenu}
      label={i18n.t("metadataquality.sitenavigation.label")}
      theme="magenta"
    />
  );
}
