"use client";

import { i18n } from "@/i18n";
import { usePathname } from "next/navigation";
import { GlobalIds } from "@/app/_lib/globalIds";
import { PAGES, PAGES_AUTH } from "@/app/_lib/URLHelper";

function SkipLink({ id, name }: { id: string; name: string }) {
  return <a href={`#${id}`}>{name}</a>;
}
const toNav = {
  id: GlobalIds.navigation,
  name: i18n.t("skiplinks.to.navigation"),
};

const toSearch = {
  id: GlobalIds.searchField,
  name: i18n.t("skiplinks.to.quicksearch"),
};

const toGeoSearch = {
  id: GlobalIds.searchField,
  name: i18n.t("skiplinks.to.geosearch"),
};

const toMain = {
  id: GlobalIds.mainContent,
  name: i18n.t("skiplinks.to.maincontent"),
};

export function QuickAccessNavigation() {
  const pathname = usePathname();
  const links: { id: string; name: string }[] = [];

  switch (true) {
    case pathname.startsWith(PAGES.extendedSearch):
    case pathname.startsWith(PAGES.dlde):
    case pathname.startsWith(PAGES_AUTH.manage_data):
      links.push(toNav, toMain);
      break;
    case pathname.startsWith(PAGES.geosearch):
      links.push(toNav, toMain, toGeoSearch);
      break;
    default:
      links.push(toNav, toSearch, toMain);
      break;
  }

  return (
    <nav className="quick-access-nav" aria-label={i18n.t("skiplinks.title")}>
      {links.map((link) => (
        <SkipLink key={link.id} {...link} />
      ))}
    </nav>
  );
}
