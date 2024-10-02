import { i18n } from "@/i18n";
import { Trans } from "@/app/_components/Trans/Trans";
import { ExternalLink } from "@/app/_components/ExternalLink/ExternalLink";
import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";

export function QualitaetsmerkmaleInfo() {
  return (
    <ContainerSection
      headline="Qualitätsmerkmale"
      headlineLevel="h2"
      containerWidth="lg"
      centerHeadline
      modifier={[
        ContainerWrapperModifier.BG_WHITE,
        ContainerWrapperModifier.PADDING_Y,
      ]}
    >
      <Trans
        i18nKey="metadataquality.qualitaetsmerkmaleinfo"
        htmlElement="paragraph"
        params={{
          linkSunlightFoundation: (
            <ExternalLink
              href="https://www.govdata.de/documents/10156/18448/GovData_Open-Data-Kriterien_der_Sunlight_Foundation.pdf/dca8fea0-8e04-4de0-8531-2bc3e8d4abc0"
              title={i18n.t(
                "metadataquality.qualitaetsmerkmaleinfo.linkSunlightFoundation",
              )}
            />
          ),
          linkFair: (
            <ExternalLink
              href="https://www.europeandataportal.eu/mqa/methodology?locale=de"
              title={i18n.t("metadataquality.qualitaetsmerkmaleinfo.linkFair")}
            />
          ),
          linkDcat: (
            <ExternalLink
              href="https://www.dcat-ap.de/def/"
              title="DCAT-AP.de"
            />
          ),
        }}
      />
    </ContainerSection>
  );
}
