import React from "react";
import { Metadata } from "next";

import {
  ContainerDiv,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { fetchCategoriesSorted } from "@/app/_lib/getData";
import { ShowcaseForm } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/ShowcaseForm";
import { i18n } from "@/i18n";

export const metadata: Metadata = {
  title: i18n.t("meta.manageshowcases.create"),
};

export default async function Page() {
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
