import { Metadata } from "next";

import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import {
  fetchAvailableHvdCategoryUris,
  fetchCategoriesSorted,
  fetchHvdCategoryMap,
  fetchLicenseActiveSorted,
  fetchOrganizationSorted,
  fetchResourceFormatsSorted,
  fetchStateList,
} from "@/app/_lib/getData";
import { metaDataGenerator } from "@/app/_lib/getMetaData";
import { filterHvdMapToAvailable } from "@/app/_lib/hvdCategories";
import { ExtendedSearchFields } from "@/app/erweitertesuche/ExtendedSearchFields";
import { i18n } from "@/i18n";
import { PageConstructor } from "@/types/types";

export const metadata: Metadata = metaDataGenerator({
  title: i18n.t("meta.erweitertesuche.title"),
});

export default async function ErweiterteSuche(
  props: Readonly<PageConstructor>,
) {
  const searchParams = await props.searchParams;
  const stateList = await fetchStateList();
  const categoriesSorted = await fetchCategoriesSorted();
  const licenseActiveSorted = await fetchLicenseActiveSorted();
  const organizationSorted = await fetchOrganizationSorted();
  const resourceFormatsSorted = await fetchResourceFormatsSorted();

  // Only offer HVD categories the user could actually get a hit on: fetch the full
  // vocabulary and the current facet keys in parallel, then reduce the map to entries
  // that are tagged on at least one dataset. Ancestors of any available entry are
  // retained so the accordion group headings stay intact. If the index service is
  // unreachable, availableHvdUris is empty — fall through to the full vocabulary
  // (which itself falls back to the legacy top-level categories if the DB is down)
  // instead of rendering an empty widget.
  const [fullHvdMap, availableHvdUris] = await Promise.all([
    fetchHvdCategoryMap(),
    fetchAvailableHvdCategoryUris(),
  ]);
  const hvdMap =
    availableHvdUris.length === 0
      ? fullHvdMap
      : filterHvdMapToAvailable(fullHvdMap, availableHvdUris);

  // disabled filter types from environment variable
  const disabledFilterTypes = process.env.disabled_elasticsearch_filter_types;

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
        hvdMap={hvdMap}
        disabledFilterTypes={disabledFilterTypes}
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
