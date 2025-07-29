"use client";

import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { ExternalLink } from "@/app/_components/ExternalLink/ExternalLink";
import { Trans } from "@/app/_components/Trans/Trans";
import { PAGES } from "@/app/_lib/URLHelper";
import { i18n } from "@/i18n";

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
        i18nKey="sparql.schnittstellen.paragraph1"
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

      <Trans
        i18nKey="sparql.schnittstellen.paragraph2"
        htmlElement="paragraph"
      />

      <Trans
        i18nKey="sparql.schnittstellen.paragraph3"
        htmlElement="paragraph"
      />
    </ContainerSection>
  );
}
