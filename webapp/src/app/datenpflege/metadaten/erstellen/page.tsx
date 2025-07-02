import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  ContainerDiv,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import {
  fetchCategoriesSorted,
  fetchLicenseActiveSorted,
  fetchOrganizationsForUser,
} from "@/app/_lib/getData";
import { hasContributorId } from "@/app/_lib/organization";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { getSessionOrRedirect } from "@/app/api/auth/_session";
import { MetadataForm } from "@/app/datenpflege/metadaten/_components/MetadataForm/MetadataForm";
import { i18n } from "@/i18n";

export const metadata: Metadata = {
  title: i18n.t("meta.managedata.create"),
};

export default async function Page() {
  const session = await getSessionOrRedirect(
    PAGES_AUTH.manage_metadata_form_add,
  );

  const organizations = await fetchOrganizationsForUser(session.username);

  if (!hasContributorId(organizations)) {
    redirect(PAGES_AUTH.manage_metadata);
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
          mailFitko={process.env.mail_fitko!}
          metadataGuideLink={process.env.metadata_guide_link!}
          metadataDcatapLink={process.env.metadata_dcatap_link!}
        />
      </ContainerDiv>
    </>
  );
}
