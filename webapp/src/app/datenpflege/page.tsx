import { i18n } from "@/i18n";
import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import React from "react";
import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { ButtonLink } from "@/app/_components/Button/ButtonLink";
import { icons, SVG } from "@/app/_components/SVG/SVG";
import { getSessionOrRedirect } from "@/app/api/auth/_session";
import { MetaDataOverviewContainer } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewContainer";
import { MetaDataWelcome } from "@/app/datenpflege/_components/MetaDataWelcome";
import { Metadata } from "next";
import {
  fetchMetadataForOrganizations,
  fetchOrganizationsForUser,
} from "@/app/_lib/getData";
import { hasContributorId } from "@/app/_lib/organization";
import { MetaDataOrganizationError } from "@/app/datenpflege/_components/MetaDataOrganizationError";
import { PageConstructor } from "@/types/types";
import { MetaDataOverviewDeleteInfoBox } from "@/app/datenpflege/_components/MetaDataOverview/MetaDataOverviewDeleteInfoBox";

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
      <MetaDataOverviewDeleteInfoBox searchParams={searchParams} />
      <ContainerSection
        containerWidth="lg"
        headline={t("metadata.welcome.title", {
          name: session.username,
        })}
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
      >
        {!hasOrganization ? (
          <MetaDataOrganizationError />
        ) : (
          <>
            <MetaDataWelcome />
            <ButtonLink
              href={PAGES_AUTH.manage_data_form_add}
              variant="primary"
            >
              <SVG icon={icons.plus} size="14" />
              <span className="ms-0_5">{t("metadataform.create")}</span>
            </ButtonLink>
            {data && data.length > 0 && (
              <MetaDataOverviewContainer data={data} />
            )}
          </>
        )}
      </ContainerSection>
    </>
  );
}
