import { i18n } from "@/i18n";
import { TagLicense } from "@/app/_components/Tag/TagLicense";
import { Trans } from "@/app/_components/Trans/Trans";
import { TagHVD } from "@/app/_components/Tag/TagHVD";
import { ExternalLink } from "@/app/_components/ExternalLink/ExternalLink";

export function DtDescription({
  description,
  term,
}: {
  term: string;
  description: string;
}) {
  if (!description) {
    return null;
  }

  return (
    <>
      <dt>{term}</dt>
      <dd>{description}</dd>
    </>
  );
}

export function DtLicense({ license }: { license: any }) {
  return license?.active ? (
    <>
      <dt className="d-inline-block">
        {i18n.t("resources.table.panel.license")}
      </dt>
      <dd className="d-inline">
        <span className="ms-1">
          <TagLicense open={license?.open} />
        </span>
        {license.url && (
          <ExternalLink
            className="mb-2 d-block"
            title={license?.title}
            href={license.url}
          />
        )}
      </dd>
    </>
  ) : null;
}

export function DtWithExternalLinks({
  urls,
  term,
}: {
  urls?: string[];
  term: string;
}) {
  return urls && urls.length > 0 ? (
    <>
      <dt>{term}</dt>
      {urls.map((url, index) => (
        <dd key={url + index}>
          <ExternalLink title={url} href={url} />
        </dd>
      ))}
    </>
  ) : null;
}

export function DtShortendAvailability({
  availability,
}: {
  availability?: string;
}) {
  return availability ? (
    <>
      <dt>{i18n.t("search.details.accessService.shortendAvailability")}</dt>
      <dd>
        <Trans
          i18nKey={`availability.${availability.toLowerCase()}`}
          params={{
            type: <i>{availability.toLowerCase()}</i>,
          }}
        />
      </dd>
    </>
  ) : null;
}

export function DtHVD() {
  return (
    <>
      <dt>{i18n.t("search.details.infobox.decoration")}</dt>
      <dd>
        <TagHVD />
      </dd>
    </>
  );
}
