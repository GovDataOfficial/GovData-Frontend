"use client";

import { i18n } from "@/i18n";

import { Trans } from "@/app/_components/Trans/Trans";
import { ExternalLink } from "@/app/_components/ExternalLink/ExternalLink";
import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";

export function SectionSparqlAssistent() {
  return (
    <ContainerSection
      headline={i18n.t("sparql.assistent.headline")}
      containerWidth="lg"
      centerHeadline
      headlineLevel="h2"
      modifier={[
        ContainerWrapperModifier.BOTTOM_SEPARATOR,
        ContainerWrapperModifier.BG_WHITE,
        ContainerWrapperModifier.PADDING_Y,
      ]}
    >
      <Trans
        i18nKey="sparql.assistent.paragraph1"
        htmlElement="paragraph"
        params={{
          linkDcat: (
            <ExternalLink
              title={"DCAT-AP.de"}
              href={"https://www.dcat-ap.de/def/"}
            />
          ),
        }}
      />

      <Trans i18nKey="sparql.assistent.paragraph2" htmlElement="paragraph" />

      <p>
        <code>https://www.govdata.de/sparql</code>
      </p>

      <Trans i18nKey="sparql.assistent.paragraph4" htmlElement="paragraph" />

      <Trans i18nKey="sparql.assistent.paragraph5" htmlElement="paragraph" />

      <p>
        <code>https://www.govdata.de/shacl/validation/mqa</code>
      </p>

      <Trans i18nKey="sparql.assistent.paragraph7" htmlElement="paragraph" />

      <Trans
        i18nKey="sparql.assistent.paragraph8"
        htmlElement="paragraph"
        params={{
          link: (
            <ExternalLink
              title={"W3C-Webseite"}
              href="https://www.w3.org/TR/rdf-sparql-query/"
            />
          ),
        }}
      />

      <Trans
        i18nKey="sparql.assistent.paragraph9"
        htmlElement="paragraph"
        params={{
          link: (
            <ExternalLink
              href="https://addons.mozilla.org/de/firefox/addon/rested/"
              title={"RESTED"}
            />
          ),
        }}
      />
    </ContainerSection>
  );
}
