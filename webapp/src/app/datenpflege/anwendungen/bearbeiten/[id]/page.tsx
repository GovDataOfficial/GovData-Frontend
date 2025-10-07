import React from "react";
import { Metadata } from "next";

import {
  ContainerDiv,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { fetchCategoriesSorted, fetchShowcase } from "@/app/_lib/getData";
import { ShowcaseForm } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/ShowcaseForm";
import { i18n } from "@/i18n";
import { PageConstructor } from "@/types/types";

export const metadata: Metadata = {
  title: i18n.t("meta.manageshowcases.edit"),
};

export default async function Page(props: PageConstructor<{ id: string }>) {
  const params = await props.params;
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
