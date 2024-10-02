"use client";

import { usePathname } from "next/navigation";
import Search from "@/app/_components/Search/Search";
import { PAGES, PAGES_AUTH } from "@/app/_lib/URLHelper";
import { Background } from "@/app/_components/Background/Background";

export function SearchHeaderSwitcher() {
  const pathName = usePathname();

  // this approach is not feasible in the long run.
  // need to differentiate with urls between layouts. maybe with nextjs groups ?
  switch (true) {
    case pathName === "/":
      return <Search withTeaser />;
    case pathName.startsWith(PAGES.extendedSearch):
    case pathName.startsWith(PAGES.dlde):
      return <Background />;
    case pathName.startsWith(PAGES.geosearch):
    case pathName.startsWith(PAGES_AUTH.manage_data):
      return null;
    case pathName.startsWith(PAGES.search):
      return <Search keepFiltersForSearch />;
    case pathName.startsWith(PAGES.metadataquality):
      return <Search backgroundImage="metadataquality" />;
    case pathName.startsWith(PAGES.sparql):
      return <Search backgroundImage="devcorner" />;
    case pathName.startsWith(PAGES.information):
      return <Search backgroundImage="info" />;
    default:
      return <Search />;
  }
}
