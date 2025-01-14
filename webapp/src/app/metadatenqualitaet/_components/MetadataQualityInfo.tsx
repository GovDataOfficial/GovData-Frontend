import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { ExternalLink } from "@/app/_components/ExternalLink/ExternalLink";
import { Trans } from "@/app/_components/Trans/Trans";
import { i18n } from "@/i18n";

export function MetadataQualityInfo() {
  return (
    <ContainerSection
      centerHeadline
      containerWidth="lg"
      headline="Dashboard zur Metadatenqualität"
      modifier={[
        ContainerWrapperModifier.BG_WHITE,
        ContainerWrapperModifier.PADDING_Y,
      ]}
    >
      <Trans
        i18nKey="metadataquality.info"
        htmlElement="paragraph"
        params={{
          linkEndpoint: (
            <ExternalLink
              title={i18n.t("metadataquality.info.linkendpoint.title")}
              href="/sparql"
            />
          ),
          linkSparql: (
            <ExternalLink
              title={i18n.t("metadataquality.info.linkSparql.title")}
              href="/sparql-assistent"
            />
          ),
          linkDcatValidator: (
            <ExternalLink
              title={i18n.t("metadataquality.info.linkDcatValidator.title")}
              href="https://www.itb.ec.europa.eu/shacl/dcat-ap.de/upload"
            />
          ),
        }}
      />
    </ContainerSection>
  );
}
