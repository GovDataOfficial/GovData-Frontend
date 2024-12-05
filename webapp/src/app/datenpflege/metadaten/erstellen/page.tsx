import { Metadata } from "next";
import {
  ContainerDiv,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import React from "react";
import {
  fetchCategoriesSorted,
  fetchLicenseActiveSorted,
  fetchOrganizationsForUser,
} from "@/app/_lib/getData";
import { i18n } from "@/i18n";
import { MetadataForm } from "@/app/datenpflege/_components/MetaDataForm/MetadataForm";
import { getSessionOrRedirect } from "@/app/api/auth/_session";
import { redirect } from "next/navigation";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { hasContributorId } from "@/app/_lib/organization";

export const metadata: Metadata = {
  title: i18n.t("meta.managedata.create"),
};

export default async function Page() {
  const session = await getSessionOrRedirect();

  const organizations = await fetchOrganizationsForUser(session.username);

  if (!hasContributorId(organizations)) {
    redirect(PAGES_AUTH.manage_data);
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
          mailFitko={process.env.mail_fitko}
        />
      </ContainerDiv>
    </>
  );
}
