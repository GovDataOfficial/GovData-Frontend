import { i18n } from "@/i18n";
import { MenuItem } from "@/app/_components/MenuItem/MenuItem";

const dataMenuItem: MenuItem = {
  href: "/daten",
  name: i18n.t("header.navigation.daten"),
  color: "data-green",
};

const metaDataQuality: MenuItem = {
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

export const menuSettings: MenuItem[] =
  process.env.metadata_quality_dashboard_active === "1"
    ? [dataMenuItem, metaDataQuality, sparqlMenuItem, informationMenuitem]
    : [dataMenuItem, sparqlMenuItem, informationMenuitem];

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
