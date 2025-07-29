import { Metadata } from "next";

import Suche from "@/app/suche/page";
import { i18n } from "@/i18n";
import { PageConstructor } from "@/types/types";

export const metadata: Metadata = {
  title: i18n.t("meta.daten.title"),
};
export default function Page(props: PageConstructor) {
  return (
    <Suche /* @next-codemod-error 'props' is used with spread syntax (...). Any asynchronous properties of 'props' must be awaited when accessed. */
      {...props}
      searchParams={{ type: "dataset" }}
    />
  );
}
