import { ExternalLink } from "@/app/_components/ExternalLink/ExternalLink";
import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";
import { Trans } from "@/app/_components/Trans/Trans";
import { i18n } from "@/i18n";

type MetadataFormHelpBox = {
  metadataGuideLink: string;
  metadataDcatapLink: string;
};

export function MetadataFormHelpBox({
  metadataGuideLink,
  metadataDcatapLink,
}: MetadataFormHelpBox) {
  return (
    <InfoBox variant="info" title={i18n.t("metadataform.help.title")}>
      <Trans
        i18nKey="metadataform.help.description"
        params={{
          link: (
            <ExternalLink
              href={metadataGuideLink}
              title={i18n.t("metadataform.help.guideLink")}
            />
          ),
          link2: (
            <ExternalLink
              href={metadataDcatapLink}
              title={i18n.t("metadataform.help.dcatpapLink")}
            />
          ),
        }}
      />
    </InfoBox>
  );
}
