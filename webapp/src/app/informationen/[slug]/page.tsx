import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContainerDiv } from "@/app/_components/Container";
import { EditorialContent } from "@/app/_components/EditorialContent/EditorialContent";
import { SiteNavigationT3 } from "@/app/_components/SiteNavBar/SiteNavigationT3";
import { UserSurveyHeader } from "@/app/_components/UserSurveyHeader/UserSurveyHeader";
import { fetchMetadata, fetchTypo3Data } from "@/app/_lib/getData";
import { metaDataGenerator } from "@/app/_lib/getMetaData";
import { endpoints } from "@/configuration/endpoints";
import { i18n } from "@/i18n";
import { findT3ContentElement } from "@/types/typeGuards";
import { PageConstructor } from "@/types/types";

async function getPageData(params: PageConstructor["params"]) {
  return fetchTypo3Data(endpoints.T3.informationen + `/${params.slug}`);
}

export async function generateMetadata(
  props: PageConstructor,
): Promise<Metadata> {
  const params = await props.params;
  const pageData = await getPageData(params);
  return metaDataGenerator({
    title: i18n.t("meta.dynamic.title", { title: pageData?.meta.title }),
    description: pageData?.meta.description,
  });
}

export default async function Page(props: PageConstructor) {
  const params = await props.params;
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
      <ContainerDiv containerWidth="lg">
        <UserSurveyHeader />
      </ContainerDiv>
      <EditorialContent pageData={pageData} />
    </>
  );
}
