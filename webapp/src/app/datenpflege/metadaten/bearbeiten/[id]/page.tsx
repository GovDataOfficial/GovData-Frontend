import { Metadata } from "next";
import {
  ContainerDiv,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import React from "react";
import {
  fetchCategoriesSorted,
  fetchLicenseActiveSorted,
  fetchMetadata,
  fetchOrganizationsForUser,
} from "@/app/_lib/getData";
import { i18n } from "@/i18n";
import { MetadataForm } from "@/app/datenpflege/_components/MetaDataForm/MetadataForm";
import { getSessionOrRedirect } from "@/app/api/auth/_session";
import { redirect } from "next/navigation";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { hasContributorId } from "@/app/_lib/organization";
import { PageConstructor } from "@/types/types";
import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { logger } from "@/logger/logger";

export const metadata: Metadata = {
  title: i18n.t("meta.managedata.edit"),
};

export default async function Page({
  params,
}: PageConstructor<{ id: string }>) {
  const session = await getSessionOrRedirect();

  const organizations = await fetchOrganizationsForUser(session.username);

  // user has no org
  if (!hasContributorId(organizations)) {
    redirect(PAGES_AUTH.manage_data);
  }

  const data = await fetchMetadata(params.id);
  const hasSameOrg =
    data && organizations?.some((org) => org.id === data.owner_org);

  if (!data || !hasSameOrg) {
    return (
      <ContainerDiv
        containerWidth="lg"
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        <InfoBox
          className="mt-3"
          title={i18n.t("metadataform.erros.couldNotLoadOrNotAuthorized")}
          variant={"error"}
        />
      </ContainerDiv>
    );
  }

  const categories = await fetchCategoriesSorted();
  const licenses = await fetchLicenseActiveSorted();
  return (
    <>
      <ContainerDiv
        containerWidth="lg"
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        <MetadataForm
          categories={categories}
          licenses={licenses}
          organizations={organizations!}
          metaData={data}
        />
      </ContainerDiv>
    </>
  );
}
