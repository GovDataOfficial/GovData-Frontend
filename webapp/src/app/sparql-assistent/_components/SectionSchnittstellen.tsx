"use client";
import { i18n } from "@/i18n";
import { Trans } from "@/app/_components/Trans/Trans";
import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { PAGES } from "@/app/_lib/URLHelper";
import { ExternalLink } from "@/app/_components/ExternalLink/ExternalLink";

export function SectionSchnittstellen() {
  return (
    <ContainerSection
      containerWidth="lg"
      centerHeadline
      headlineLevel="h2"
      modifier={[
        ContainerWrapperModifier.BG_WHITE,
        ContainerWrapperModifier.BOTTOM_SEPARATOR,
        ContainerWrapperModifier.PADDING_Y,
      ]}
      headline={i18n.t("sparql.schnittstellen.headline")}
    >
      <Trans
        i18nKey="sparql.schnittstellen.text"
        htmlElement="paragraph"
        params={{
          linkMetadatenkatalog: (
            <a
              href={PAGES.search_details_dataset + "/govdata-metadatenkatalog"}
              rel="nofollow"
            >
              Metadatenkatalog
            </a>
          ),
          linkCkan: (
            <ExternalLink
              title={"CKAN API"}
              href={"https://docs.ckan.org/en/2.10/api/index.html"}
            />
          ),
          codeSparql: <code>https://www.govdata.de/sparql</code>,
          codeCkan: <code>https://www.govdata.de/ckan/api</code>,
        }}
      />
    </ContainerSection>
  );
}
