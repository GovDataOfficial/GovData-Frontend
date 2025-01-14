import { MetadataContactRole } from "@/types/types";

export const METADATA_FORM_ID = "metadata-form";

export const METADATA_FORM_MAX_LENGTH_LONG = 10000;
export const METADATA_FORM_MAX_LENGTH_MEDIUM = 1000;
export const METADATA_FORM_MAX_LENGTH_SMALL = 255;

export const MAX_RESSOURCE_COUNT = 60;

export const METADATA_FORM_INPUTS = {
  ID: "id",
  ORGANIZATION_ID: "organizationId",
  CONTRIBUTOR_ID: "contributorId",
  TITLE: "title",
  DESCRIPTION: "description",
  TAGS: "tags",
  CATEGORIES: "categories",
  HVD_CATEGORIES: "hvd_categories",
  URL: "url",
  CONTACTS: (type: MetadataContactRole) => {
    const typeLowered = type.toLocaleLowerCase();
    return {
      name: `contacts[${typeLowered}].name`,
      email: `contacts[${typeLowered}].email`,
      url: `contacts[${typeLowered}].url`,
      address: {
        addressee: `contacts[${typeLowered}].address.addressee`,
        details: `contacts[${typeLowered}].address.details`,
        street: `contacts[${typeLowered}].address.street`,
        city: `contacts[${typeLowered}].address.city`,
        zip: `contacts[${typeLowered}].address.zip`,
        country: `contacts[${typeLowered}].address.country`,
      },
    };
  },
  RESSOURCE: (num: number) => ({
    name: `resources[${num}].name`,
    url: `resources[${num}].url`,
    description: `resources[${num}].description`,
    format: `resources[${num}].format`,
    language: `resources[${num}].language`,
    licenseId: `resources[${num}].licenseId`,
    licenseAttributionByText: `resources[${num}].licenseAttributionByText`,
    modified: `resources[${num}].modified`,
    availability: `resources[${num}].shortendAvailability`,
    hvd: `resources[${num}].hvd.`,
  }),
  POLICITICAL_GEOCODING_LEVEL: "policiticalGeocodingLevelURI",
  POLICITICAL_GEOCODING: "policiticalGeocodingURI",
  GEOCODING_TEXT: "geocodingText",
  SPATIAL: "spatial",
  LEGAL_BASIS_TEXT: "legalbasisText",
  TEMPORAL_COVERAGE_FROM: "temporalCoverageFrom",
  TEMPORAL_COVERAGE_TO: "temporalCoverageTo",
  PUBLISHED: "published",
  LAST_MODIFIED_DATE: "lastModifiedDate",
} as const;
