import { MetaData } from "@/types/types";
import { Time } from "@/app/_components/Time/Time";
import { TimeRange } from "@/app/_components/Time/TimeRange";
import { i18n } from "@/i18n";
import { getOrganizationDisplayName } from "@/app/_lib/getDisplayName";
import { SearchDetailsInfoBoxGroup } from "@/app/suche/_components/SearchDetailsInfobox/partials/SearchDetailsInfoBoxGroup";
import { TermCategories } from "@/app/suche/_components/SearchDetailsInfobox/partials/TermCategories";
import { DLTags } from "@/app/suche/_components/SearchDetailsInfobox/partials/DLTags";
import { SearchDetailsInfoBoxContainer } from "@/app/suche/_components/SearchDetailsInfobox/partials/SearchDetailsInfoBoxContainer";
import downloadIcon from "../../../_components/SVG/icons/icon_download.svg";
import Image from "next/image";
import { isNotNullOrUndefined } from "@/types/typeGuards";
import { fetchDataSetShowCaseConnection } from "@/app/_lib/getData";
import { DtHVD } from "@/app/suche/_components/common/CommonDtDd";

type SearchDetailsInfoboxDataset = {
  data: MetaData;
};

function createCKANDatasetUrl(metaDataName: string) {
  try {
    const url = new URL(
      process.env.BE_GD_CKAN_DATASET_URL + `/${metaDataName}.rdf`,
    );
    return url.toString();
  } catch (e) {
    console.error("could not create ckan dataset url for", metaDataName);
  }
  return "#";
}

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
          <dt>{t("search.details.infobox.metaDataDownloadLink")}</dt>
          <dd>
            <a
              className="fnt-link fnt-link-download"
              target="_blank"
              href={createCKANDatasetUrl(data.name)}
            >
              <Image width={0} height={0} src={downloadIcon} alt="" />
              {t("search.details.infobox.metaDataDownload")}
            </a>
          </dd>
        </SearchDetailsInfoBoxGroup>

        <SearchDetailsInfoBoxGroup>
          <dt>{t("search.details.infobox.owner")}</dt>
          <dd>{ownerDisplayName}</dd>
          {publisher && (
            <>
              <dt>{t("search.details.infobox.publisher")}</dt>
              <dd>{publisher}</dd>
            </>
          )}
        </SearchDetailsInfoBoxGroup>

        {hasCategories && (
          <SearchDetailsInfoBoxGroup>
            <TermCategories
              title={t("search.details.infobox.categories")}
              categories={categories.map((c) => c.name)}
            />
          </SearchDetailsInfoBoxGroup>
        )}

        {isHVD && (
          <SearchDetailsInfoBoxGroup>
            <DtHVD />
            <TermCategories
              title={t("search.details.infobox.categoriesHvd")}
              categories={hvdCategories}
            />
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
      <DLTags tags={tags.map((tag) => tag.name)} />
      {showCaseConnection && showCaseConnection.items?.length > 0 && (
        <dl className="mt-3">
          <dt>{t("search.details.infobox.datasetShowCaseConnection")}</dt>
          {showCaseConnection.items.map((item) => (
            <dd key={item.id}>
              <a className="fnt-link " href={`/suche/anwendung/${item.id}`}>
                {item.title}
              </a>
            </dd>
          ))}
        </dl>
      )}
    </SearchDetailsInfoBoxContainer>
  );
}
