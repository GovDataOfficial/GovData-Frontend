import { Time } from "@/app/_components/Time/Time";
import { TimeRange } from "@/app/_components/Time/TimeRange";
import { fetchDataSetShowCaseConnection } from "@/app/_lib/getData";
import { getOrganizationDisplayName } from "@/app/_lib/organization";
import { FILTERS } from "@/app/_lib/URLHelper";
import { DtHVD } from "@/app/suche/_components/common/CommonDtDd";
import { MetadataPreview } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreview";
import { DLTags } from "@/app/suche/_components/SearchDetailsInfobox/partials/DLTags";
import { SearchDetailsInfoBoxContainer } from "@/app/suche/_components/SearchDetailsInfobox/partials/SearchDetailsInfoBoxContainer";
import { SearchDetailsInfoBoxGroup } from "@/app/suche/_components/SearchDetailsInfobox/partials/SearchDetailsInfoBoxGroup";
import { TermCategories } from "@/app/suche/_components/SearchDetailsInfobox/partials/TermCategories";
import { SearchDetailsInfoboxFilterTagAnchor } from "@/app/suche/_components/SearchDetailsInfobox/SearchDetailsInfoboxFilterTagAnchor";
import { i18n } from "@/i18n";
import { isNotNullOrUndefined } from "@/types/typeGuards";
import { Metadata } from "@/types/types";

type SearchDetailsInfoboxDataset = {
  data: Metadata;
};

export async function SearchDetailsInfoboxDataSet({
  data,
}: SearchDetailsInfoboxDataset) {
  const { t } = i18n;

  if (!data) {
    return null;
  }

  const {
    name,
    lastModifiedDate,
    published,
    owner_org,
    temporalCoverageTo,
    temporalCoverageFrom,
    geocodingText,
    contacts,
    tags,
    categories,
    hvdCategories,
    documentation,
  } = data;

  const ownerDisplayName = await getOrganizationDisplayName(owner_org);
  const showCaseConnection = await fetchDataSetShowCaseConnection(name);
  const publisher = contacts.find((c) => c.role === "PUBLISHER")?.name;
  const isHVD = data.hvd;
  const geoCodingValues = geocodingText?.filter(isNotNullOrUndefined);
  const hasCategories = data.categories?.length > 0;
  const hasTemporalCoverage = temporalCoverageFrom && temporalCoverageTo;
  const hasGeoCodingValues = geoCodingValues && geoCodingValues.length > 0;

  return (
    <SearchDetailsInfoBoxContainer
      headline={t("search.details.infobox.headline.dataset")}
      hvd={isHVD}
    >
      <dl>
        <SearchDetailsInfoBoxGroup>
          <dt>{t("search.details.infobox.lastModifiedDate")}</dt>
          <dd>
            <Time date={lastModifiedDate} />
          </dd>
          {published && (
            <>
              <dt>{t("search.details.infobox.publishedDate")}</dt>
              <dd>
                <Time date={published} />
              </dd>
            </>
          )}
        </SearchDetailsInfoBoxGroup>

        <SearchDetailsInfoBoxGroup>
          <dt>Metadaten</dt>
          <dd>
            <MetadataPreview
              metadataName={data.name}
              backendUrl={process.env.BE_GD_CKAN_DATASET_URL}
            />
          </dd>
        </SearchDetailsInfoBoxGroup>

        <SearchDetailsInfoBoxGroup>
          <dt>{t("search.details.infobox.owner")}</dt>
          <dd>
            <SearchDetailsInfoboxFilterTagAnchor
              searchCriteria={FILTERS.SOURCEPORTAL}
              searchCriteriaValue={owner_org}
            >
              {ownerDisplayName}
            </SearchDetailsInfoboxFilterTagAnchor>
          </dd>
          {publisher && (
            <>
              <dt>{t("search.details.infobox.publisher")}</dt>
              <dd>
                <SearchDetailsInfoboxFilterTagAnchor
                  searchCriteria={FILTERS.PUBLISHER}
                  searchCriteriaValue={publisher}
                >
                  {publisher}
                </SearchDetailsInfoboxFilterTagAnchor>
              </dd>
            </>
          )}
        </SearchDetailsInfoBoxGroup>

        {hasCategories && (
          <SearchDetailsInfoBoxGroup>
            <TermCategories
              title={t("search.details.infobox.categories")}
              categories={categories}
            />
          </SearchDetailsInfoBoxGroup>
        )}

        {isHVD && (
          <SearchDetailsInfoBoxGroup>
            <DtHVD />
            <TermCategories
              isHVD={isHVD}
              title={t("search.details.infobox.categoriesHvd")}
              categories={hvdCategories}
            />
          </SearchDetailsInfoBoxGroup>
        )}

        {documentation && documentation.length > 0 && (
          <SearchDetailsInfoBoxGroup>
            <dt>{t("search.details.infobox.documentation.headline")}</dt>

            {documentation.map((doc, index) => (
              <dd key={index} className="mark-external-links">
                <a href={doc} target="_blank" rel="noreferrer">
                  {documentation.length > 1
                    ? `${t("search.details.infobox.documentation.link")} ${index + 1}`
                    : t("search.details.infobox.documentation.link")}
                </a>
              </dd>
            ))}
          </SearchDetailsInfoBoxGroup>
        )}

        {(hasTemporalCoverage || hasGeoCodingValues) && (
          <SearchDetailsInfoBoxGroup>
            {temporalCoverageFrom && temporalCoverageTo && (
              <>
                <dt>{t("search.details.infobox.temporalCoverage")}</dt>
                <dd>
                  <TimeRange
                    from={temporalCoverageFrom}
                    to={temporalCoverageTo}
                  />
                </dd>
              </>
            )}
            {geoCodingValues && geoCodingValues.length > 0 && (
              <>
                <dt>{t("search.details.infobox.geoCoding")}</dt>
                <dd>{geoCodingValues?.join(", ")}</dd>
              </>
            )}
          </SearchDetailsInfoBoxGroup>
        )}
      </dl>
      <DLTags tags={tags} />
      {showCaseConnection && showCaseConnection.items?.length > 0 && (
        <dl className="mt-3">
          <dt>{t("search.details.infobox.datasetShowCaseConnection")}</dt>
          {showCaseConnection.items.map((item) => (
            <dd key={item.id}>
              <a href={`/suche/anwendung/${item.id}`}>{item.title}</a>
            </dd>
          ))}
        </dl>
      )}
    </SearchDetailsInfoBoxContainer>
  );
}
