import { PageConstructor } from "@/types/types";
import { fetchMetadata, fetchTypo3Data } from "@/app/_lib/getData";
import { endpoints } from "@/configuration/endpoints";
import { findT3ContentElement } from "@/types/typeGuards";
import { EditorialContent } from "@/app/_components/EditorialContent/EditorialContent";
import { SiteNavigationT3 } from "@/app/_components/SiteNavBar/SiteNavigationT3";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { i18n } from "@/i18n";
import { metaDataGenerator } from "@/app/_lib/getMetaData";

async function getPageData(params: PageConstructor["params"]) {
  return fetchTypo3Data(endpoints.T3.informationen + `/${params.slug}`);
}

export async function generateMetadata({
  params,
}: PageConstructor): Promise<Metadata> {
  const pageData = await getPageData(params);
  return metaDataGenerator({
    title: i18n.t("meta.dynamic.title", { title: pageData?.meta.title }),
    description: pageData?.meta.description,
  });
}

export default async function Page({ params }: PageConstructor) {
  const menuData = await fetchTypo3Data(endpoints.T3Api.information);
  const subPages = findT3ContentElement(menuData, "menu_subpages");

  const pageData = await getPageData(params);
  if (!pageData) {
    notFound();
  }

  return (
    <>
      <div className="d-none d-md-block">
        <SiteNavigationT3 subPages={subPages} />
      </div>
      <EditorialContent pageData={pageData} />
    </>
  );
}
