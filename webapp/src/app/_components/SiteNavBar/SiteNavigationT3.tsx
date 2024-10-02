"use client";
import { T3MenuSubPages } from "@/types/types.typo3";
import { SiteNavigation } from "@/app/_components/SiteNavBar/SiteNavigation";
import { i18n } from "@/i18n";

type SiteNavigationT3 = {
  subPages?: T3MenuSubPages;
};

export function SiteNavigationT3({ subPages }: SiteNavigationT3) {
  const items = subPages?.content?.menu;

  return <SiteNavigation items={items} label={i18n.t("sitenavbar.label")} />;
}
