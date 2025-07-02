import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  ContainerDiv,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { fetchCategoriesSorted } from "@/app/_lib/getData";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import {
  getSessionOrRedirect,
  getUserInformation,
} from "@/app/api/auth/_session";
import { ShowcaseForm } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/ShowcaseForm";
import { i18n } from "@/i18n";

export const metadata: Metadata = {
  title: i18n.t("meta.manageshowcases.create"),
};

export default async function Page() {
  await getSessionOrRedirect(PAGES_AUTH.manage_showcases_form_add);

  const userInformation = await getUserInformation();
  if (!userInformation?.isShowcaseEditor) {
    redirect(PAGES_AUTH.manage_showcases);
  }

  const categories = await fetchCategoriesSorted();

  return (
    <>
      <ContainerDiv
        containerWidth="lg"
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        <ShowcaseForm categories={categories} />
      </ContainerDiv>
    </>
  );
}
