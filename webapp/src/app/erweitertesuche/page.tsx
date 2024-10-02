import { Metadata } from "next";
import { i18n } from "@/i18n";
import { ExtendedSearchFields } from "@/app/erweitertesuche/ExtendedSearchFields";
import {
  fetchCategoriesSorted,
  fetchLicenseActiveSorted,
  fetchOrganizationSorted,
  fetchResourceFormatsSorted,
  fetchStateList,
} from "@/app/_lib/getData";
import { PageConstructor } from "@/types/types";
import React from "react";
import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { metaDataGenerator } from "@/app/_lib/getMetaData";

export const metadata: Metadata = metaDataGenerator({
  title: i18n.t("meta.erweitertesuche.title"),
});

export default async function ErweiterteSuche({
  searchParams,
}: PageConstructor) {
  const stateList = await fetchStateList();
  const categoriesSorted = await fetchCategoriesSorted();
  const licenseActiveSorted = await fetchLicenseActiveSorted();
  const organizationSorted = await fetchOrganizationSorted();
  const resourceFormatsSorted = await fetchResourceFormatsSorted();

  // active filter types provides by BE
  const filterTypes = process.env.elasticsearch_filter_types;

  return (
    <ContainerSection
      containerWidth={"lg"}
      headline={i18n.t("page.erweitertesuche.headline")}
      modifier={[ContainerWrapperModifier.MARGIN_TOP]}
    >
      <ExtendedSearchFields
        searchParams={searchParams}
        stateList={stateList}
        categoriesSorted={categoriesSorted}
        licenseActiveSorted={licenseActiveSorted}
        organizationSorted={organizationSorted}
        resourceFormatsSorted={resourceFormatsSorted}
        filterTypes={filterTypes}
      />
      <div className="row mt-2">
        <div className="col-12 col-md-4 col-lg-6">
          <h2 className="h2 mt-0">
            {i18n.t("search.extended.helptext.title")}
          </h2>
        </div>
        <div className="col-12 col-md-8 col-lg-6">
          <p className="mt-0">
            {i18n.t("search.extended.helptext.description1")}
          </p>
          <p>
            {i18n.t("search.extended.helptext.description2")}
            <span className="sbi-trashcan" />
            {i18n.t("search.extended.helptext.description3")}
          </p>
        </div>
      </div>
    </ContainerSection>
  );
}
