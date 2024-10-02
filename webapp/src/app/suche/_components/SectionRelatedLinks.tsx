import { ShowCaseData } from "@/types/types";
import { i18n } from "@/i18n";
import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { ExternalLink } from "@/app/_components/ExternalLink/ExternalLink";

type SectionRelatedLinks = {
  data: ShowCaseData;
};

const renderList = (
  data: { name: string; url: string; id: number }[],
  title: string,
) => {
  return (
    <>
      <h3 className="mb-1">{title}</h3>
      <ul className="gd-list">
        {data.map((link) => (
          <li key={link.id}>
            <ExternalLink title={link.name} href={link.url} />
          </li>
        ))}
      </ul>
    </>
  );
};

export function SectionRelatedLinks({ data }: SectionRelatedLinks) {
  const { t } = i18n;
  const {
    linksToShowcase,
    usedDatasets,
    linkToSourcesUrl,
    linkToSourcesName,
    website,
  } = data;

  const hasShowCaseLinks = linksToShowcase?.length > 0;
  const hasUsedDatasets = usedDatasets?.length > 0;
  const hasLinkToSources = linkToSourcesUrl && linkToSourcesUrl !== "";
  const hasWebsite = website && website !== "";

  if (
    !hasShowCaseLinks &&
    !hasUsedDatasets &&
    !hasLinkToSources &&
    !hasWebsite
  ) {
    return null;
  }

  return (
    <DesignBox>
      <h2>{t("search.details.relatedLinks.title")}</h2>
      {hasShowCaseLinks && (
        <>
          {renderList(
            usedDatasets,
            t("search.details.relatedLinks.linksToShowcase"),
          )}
        </>
      )}
      {hasUsedDatasets && (
        <>
          {renderList(
            usedDatasets,
            t("search.details.relatedLinks.usedDatasets"),
          )}
        </>
      )}

      {linkToSourcesUrl && (
        <>
          <h3 className="mb-1">
            {t("search.details.relatedLinks.linkToSources")}
          </h3>
          <ExternalLink title={linkToSourcesName} href={linkToSourcesUrl} />
        </>
      )}

      {website && (
        <>
          <h3 className="mb-1">{t("search.details.relatedLinks.website")}</h3>
          <ExternalLink title={website} href={website} />
        </>
      )}
    </DesignBox>
  );
}
