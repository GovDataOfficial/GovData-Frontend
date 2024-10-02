import { fetchTypo3Data } from "@/app/_lib/getData";
import { endpoints } from "@/configuration/endpoints";
import { findT3ContentElement } from "@/types/typeGuards";
import { MenuItem } from "@/app/_components/MenuItem/MenuItem";
import { OffCanvasMenuContainer } from "@/app/_components/OffCanvasMenu/OffCanvasMenuContainer";
import { menuSettings } from "@/configuration/menuSettings";

export async function OffCanvasMenu() {
  const pageData = await fetchTypo3Data(endpoints.T3Api.information);
  const infoSubMenu = findT3ContentElement(pageData, "menu_subpages");

  const mappedInfoSubMenu: MenuItem[] | undefined =
    infoSubMenu?.content.menu.map((subPages) => ({
      href: subPages.link,
      name: subPages.title,
    }));

  return (
    <OffCanvasMenuContainer
      menuItem={mappedInfoSubMenu}
      menuSettings={menuSettings}
    />
  );
}
