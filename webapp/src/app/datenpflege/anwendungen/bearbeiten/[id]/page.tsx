import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  ContainerDiv,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { fetchCategoriesSorted, fetchShowcase } from "@/app/_lib/getData";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import {
  getSessionOrRedirect,
  getUserInformation,
} from "@/app/api/auth/_session";
import { ShowcaseForm } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/ShowcaseForm";
import { i18n } from "@/i18n";
import { PageConstructor } from "@/types/types";

export const metadata: Metadata = {
  title: i18n.t("meta.manageshowcases.edit"),
};

export default async function Page({
  params,
}: PageConstructor<{ id: string }>) {
  await getSessionOrRedirect(
    `${PAGES_AUTH.manage_showcases_form_edit}/${params.id}`,
  );

  const userInformation = await getUserInformation();
  if (!userInformation?.isShowcaseEditor) {
    redirect(PAGES_AUTH.manage_showcases);
  }

  const data = await fetchShowcase(params.id);

  if (!data) {
    return (
      <ContainerDiv
        containerWidth="lg"
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        <InfoBox
          className="mt-3"
          title={i18n.t("showcaseform.erros.couldNotLoadOrNotAuthorized")}
          variant={"error"}
        />
      </ContainerDiv>
    );
  }

  const categories = await fetchCategoriesSorted();
  return (
    <>
      <ContainerDiv
        containerWidth="lg"
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        <ShowcaseForm categories={categories} showcaseData={data} />
      </ContainerDiv>
    </>
  );
}
