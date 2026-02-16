import { MenuItem } from "@/app/_components/MenuItem/MenuItem";
import { MenuItemMobile } from "@/app/_components/MenuItem/MenuItemMobile";
import { isFeatureEnabled } from "@/app/_lib/features";
import { Feature } from "@/configuration/featureFlags/types";
import { i18n } from "@/i18n";

const dataMenuItem: MenuItem = {
  href: "/daten",
  name: i18n.t("header.navigation.daten"),
  color: "data-green",
};

const metaDataQuality: MenuItemMobile = {
  href: "/metadatenqualitaet",
  name: i18n.t("header.navigation.metadatenqualitaet"),
  color: "magenta",
  subMenu: [
    {
      href: "/metadatenqualitaet/qualitaetsmerkmale",
      name: i18n.t("header.navigation.metadatenqualitaet.qualitaetsmerkmale"),
      color: "magenta",
    },
    {
      href: "/metadatenqualitaet/top5",
      name: i18n.t("header.navigation.metadatenqualitaet.top5"),
      color: "magenta",
    },
  ],
};

const sparqlMenuItem: MenuItem = {
  href: "/sparql-assistent",
  name: i18n.t("header.navigation.sparql"),
  color: "devcorner-green",
};

const informationMenuitem: MenuItem = {
  href: "/informationen",
  name: i18n.t("header.navigation.informationen"),
  color: "black",
};

export const menuSettings: MenuItem[] = (() => {
  const baseItems = [dataMenuItem];

  // Add metadata quality dashboard if environment variable is set
  if (process.env.metadata_quality_dashboard_active === "1") {
    baseItems.push(metaDataQuality);
  }

  // Add SPARQL menu item if feature is enabled
  if (isFeatureEnabled(Feature.showSparql)) {
    baseItems.push(sparqlMenuItem);
  }

  // Always add information menu item
  baseItems.push(informationMenuitem);

  return baseItems;
})();

export const metaDataQualityMenu = [
  {
    link: "/metadatenqualitaet/qualitaetsmerkmale",
    title: "Qualitätsmerkmale",
  },
  {
    link: "/metadatenqualitaet/top5",
    title: "Top 5",
  },
];
