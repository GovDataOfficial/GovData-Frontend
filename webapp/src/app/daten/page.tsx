import { PageConstructor } from "@/types/types";
import Suche from "@/app/suche/page";
import { Metadata } from "next";
import { i18n } from "@/i18n";

export const metadata: Metadata = {
  title: i18n.t("meta.daten.title"),
};
export default function Page(props: PageConstructor) {
  return <Suche {...props} searchParams={{ type: "dataset" }} />;
}
