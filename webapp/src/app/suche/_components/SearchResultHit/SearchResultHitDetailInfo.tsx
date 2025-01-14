import { Tag } from "@/app/_components/Tag/Tag";
import { TagHVD } from "@/app/_components/Tag/TagHVD";
import { i18n } from "@/i18n";
import { MetadataResource } from "@/types/types";

type SearchResultHitDetailInfo = {
  hasHvd: boolean;
  resources?: MetadataResource[];
  contact?: string;
};

export function SearchResultHitDetailInfo({
  hasHvd,
  resources,
  contact,
}: SearchResultHitDetailInfo) {
  const formats = resources?.map((r) => r.format);
  const nonEmptyFormats = formats?.filter((f) => f && f !== "");
  const hasFormats = nonEmptyFormats && nonEmptyFormats.length > 0;
  const setOfFormats = Array.from(new Set(nonEmptyFormats));

  if (!hasHvd && !hasFormats && !contact) {
    return null;
  }

  return (
    <dl className="search-result-hit-detail-info">
      {hasFormats && (
        <>
          <dt className="sr-only">{i18n.t("search.hits.hit.datasets")}</dt>
          {setOfFormats.map((format) => (
            <dd key={format} className="d-inline-flex">
              <Tag uppercase title={format}>
                {format}
              </Tag>
            </dd>
          ))}
        </>
      )}
      {hasHvd && (
        <>
          <dt className="sr-only">
            {i18n.t("search.details.infobox.decoration")}
          </dt>
          <dd className="search-result-hit-detail-info-bulletpoint">
            <TagHVD />
          </dd>
        </>
      )}
      {contact && (
        <>
          <dt className="sr-only">{i18n.t("search.hits.hit.contact")}:</dt>
          <dd className="paragraph-small search-result-hit-detail-info-bulletpoint">
            {contact}
          </dd>
        </>
      )}
    </dl>
  );
}
