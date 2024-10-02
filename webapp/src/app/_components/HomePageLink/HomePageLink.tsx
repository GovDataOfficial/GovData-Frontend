import { PAGES } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";
import React from "react";

export function HomePageLink() {
  return (
    <>
      {i18n.t("link.toHomepage.1")}
      <a href={PAGES.root}>{i18n.t("link.toHomepage.2")}</a>
    </>
  );
}
