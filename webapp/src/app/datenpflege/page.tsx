import React from "react";
import { Metadata } from "next";

import { AnchorButton } from "@/app/_components/Button/AnchorButton";
import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import {
  fetchMetadataForOrganizations,
  fetchOrganizationsForUser,
} from "@/app/_lib/getData";
import { hasContributorId } from "@/app/_lib/organization";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { getSessionOrRedirect } from "@/app/api/auth/_session";
import { MetadataOrganizationError } from "@/app/datenpflege/_components/MetadataOrganizationError";
import { MetadataOverviewContainer } from "@/app/datenpflege/_components/MetadataOverview/MetadataOverviewContainer";
import { MetadataOverviewDeleteInfoBox } from "@/app/datenpflege/_components/MetadataOverview/MetadataOverviewDeleteInfoBox";
import { MetadataWelcome } from "@/app/datenpflege/_components/MetadataWelcome";
import { i18n } from "@/i18n";
import { PageConstructor } from "@/types/types";

export const metadata: Metadata = {
  title: i18n.t("meta.managedata.title"),
};

export default async function Page({ searchParams }: PageConstructor) {
  const { t } = i18n;

  const session = await getSessionOrRedirect();

  const organizations = await fetchOrganizationsForUser(session.username);
  const searchResults = await fetchMetadataForOrganizations(organizations);

  const data = searchResults ? searchResults.hits : undefined;

  const hasOrganization = hasContributorId(organizations);

  return (
    <>
      <MetadataOverviewDeleteInfoBox searchParams={searchParams} />
      <ContainerSection
        containerWidth="lg"
        headline={t("metadata.welcome.title", {
          name: session.username,
        })}
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        {!hasOrganization ? (
          <MetadataOrganizationError />
        ) : (
          <>
            <MetadataWelcome />
            <AnchorButton
              href={PAGES_AUTH.manage_data_form_add}
              variant="primary"
            >
              <SVG icon={icons.plus} size="14" />
              <span className="ms-0_5">{t("metadataform.create")}</span>
            </AnchorButton>
            {data && data.length > 0 && (
              <MetadataOverviewContainer data={data} />
            )}
          </>
        )}
      </ContainerSection>
    </>
  );
}
