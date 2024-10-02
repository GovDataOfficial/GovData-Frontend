import { fetchTypo3Data } from "@/app/_lib/getData";
import { endpoints } from "@/configuration/endpoints";
import { findT3ContentElement } from "@/types/typeGuards";
import { notFound, redirect } from "next/navigation";

export default async function Page() {
  const menuData = await fetchTypo3Data(endpoints.T3Api.information);
  const subPages = findT3ContentElement(menuData, "menu_subpages");

  const firstMenuitem = subPages?.content.menu[0];
  if (firstMenuitem) {
    redirect(firstMenuitem.link);
  }

  return notFound();
}
