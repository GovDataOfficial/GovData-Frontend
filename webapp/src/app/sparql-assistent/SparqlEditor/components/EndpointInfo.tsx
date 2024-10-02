import { Trans } from "@/app/_components/Trans/Trans";
import { InfoIcon } from "@/app/_components/InfoIcon/InfoIcon";
import { ExternalLink } from "@/app/_components/ExternalLink/ExternalLink";

export function EndpointInfo() {
  return (
    <InfoIcon title="Mehr Informationen über den Endpunkt">
      <h3>
        <Trans i18nKey="sparql.endpoint.info.headline" />
      </h3>

      <Trans
        i18nKey="sparql.endpoint.info.paragraph1"
        params={{
          linkShacl: (
            <ExternalLink
              title="DCAT-AP.de-Validator"
              href={"https://www.itb.ec.europa.eu/shacl/dcat-ap.de/upload"}
            />
          ),
        }}
      />
      <br />
      <br />
      <Trans
        i18nKey="sparql.endpoint.info.paragraph2"
        params={{
          linkValidation: (
            <a href="https://github.com/GovDataOfficial/DCAT-AP.de-SHACL-Validation/blob/master/README.md#j---dcat-ap-de-govdata-dashboard-db-shapesttl">
              hier
            </a>
          ),
          linkDcat: (
            <a href="https://github.com/GovDataOfficial/DCAT-AP.de-SHACL-Validation/blob/master/validator/resources/dashboard-live/shapes/db-shapes.ttl">
              Github
            </a>
          ),
        }}
      />
    </InfoIcon>
  );
}
