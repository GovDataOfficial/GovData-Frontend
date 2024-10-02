import { Metadata } from "next";
import {
  ContainerDiv,
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import React from "react";
import {
  fetchCategoriesSorted,
  fetchLicenseActiveSorted,
} from "@/app/_lib/getData";
import { MetadataForm } from "@/app/datenpflege/metadaten/form/MetadataForm";
import { i18n } from "@/i18n";

export const metadata: Metadata = {
  title: i18n.t("meta.managedata.create"),
};

export default async function Page() {
  const categories = await fetchCategoriesSorted();
  const licenses = await fetchLicenseActiveSorted();
  return (
    <>
      <ContainerDiv
        containerWidth="lg"
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        <MetadataForm categories={categories} licenses={licenses} />
      </ContainerDiv>
    </>
  );
}
