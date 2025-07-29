import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { P } from "pino";

import {
  ContainerDiv,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import {
  fetchCategoriesSorted,
  fetchLicenseActiveSorted,
  fetchMetadata,
  fetchOrganizationsForUser,
} from "@/app/_lib/getData";
import { hasContributorId } from "@/app/_lib/organization";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { getSessionOrRedirect } from "@/app/api/auth/_session";
import { MetadataForm } from "@/app/datenpflege/metadaten/_components/MetadataForm/MetadataForm";
import { i18n } from "@/i18n";
import { logger } from "@/logger/logger";
import { PageConstructor } from "@/types/types";

export const metadata: Metadata = {
  title: i18n.t("meta.managedata.edit"),
};

export default async function Page(props: PageConstructor<{ id: string }>) {
  const params = await props.params;
  const session = await getSessionOrRedirect(
    `${PAGES_AUTH.manage_metadata_form_edit}/${params.id}`,
  );

  const organizations = await fetchOrganizationsForUser(session.username);

  // user has no org
  if (!hasContributorId(organizations)) {
    redirect(PAGES_AUTH.manage_metadata);
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
          metadata={data}
          mailFitko={process.env.mail_fitko!}
          metadataGuideLink={process.env.metadata_guide_link!}
          metadataDcatapLink={process.env.metadata_dcatap_link!}
        />
      </ContainerDiv>
    </>
  );
}
