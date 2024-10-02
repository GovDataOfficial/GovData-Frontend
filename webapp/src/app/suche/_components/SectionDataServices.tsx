import { MetaData } from "@/types/types";
import { i18n } from "@/i18n";
import { Fragment } from "react";
import {
  DtDescription,
  DtLicense,
  DtShortendAvailability,
  DtWithExternalLinks,
} from "@/app/suche/_components/common/CommonDtDd";
import { DesignBox } from "@/app/_components/DesignBox/DesignBox";

type SectionDataServices = {
  data: MetaData;
};

export function SectionDataServices({ data }: SectionDataServices) {
  const accessServices = data.resources.flatMap((d) => d.accessServices);

  if (accessServices.length === 0) {
    return null;
  }
  const { t } = i18n;

  return (
    <DesignBox extraClasses={["mt-4"]}>
      <h2>Datenservices</h2>
      {accessServices.map((service, index) => {
        const {
          title,
          description,
          endpointUrls,
          endpointDescription,
          servesDataset,
          license,
          licenseAttributionByText,
          shortendAvailability,
        } = service;

        return (
          <Fragment key={title + index}>
            <details className="gd-a-button-icon gd-a-button-icon-border">
              <summary className="gd-a-button-icon-summary">{title}</summary>
              <div className="gd-a-button-icon-content">
                <dl className="gd-common-dl">
                  <DtDescription
                    term={t("search.details.accessService.description")}
                    description={description}
                  />
                  <DtWithExternalLinks
                    urls={endpointUrls}
                    term={t("search.details.accessService.urls")}
                  />
                  <DtDescription
                    term={t("search.details.accessService.urlsDescription")}
                    description={endpointDescription}
                  />
                  <DtWithExternalLinks
                    term={t("search.details.accessService.servesDataset")}
                    urls={servesDataset}
                  />
                  <DtLicense license={license} />
                  <DtDescription
                    term={t(
                      "search.details.accessService.licenseAttributionByText",
                    )}
                    description={licenseAttributionByText}
                  />
                  <DtShortendAvailability availability={shortendAvailability} />
                </dl>
              </div>
            </details>
          </Fragment>
        );
      })}
    </DesignBox>
  );
}
