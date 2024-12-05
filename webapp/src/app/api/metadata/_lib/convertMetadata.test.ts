import { convertMetadataFormData } from "@/app/api/metadata/_lib/convertMetadata";
import { METADATA_FORM_INPUTS } from "@/app/datenpflege/_components/MetaDataForm/formConstants";

import { describe, expect, it } from "vitest";
import { MetaDataContactRole } from "@/types/types";

describe("Convert metadata", () => {
  it("should convert metadata form data to json", () => {
    const creatorObject = METADATA_FORM_INPUTS.CONTACTS(
      MetaDataContactRole.creator,
    );
    const resourcesObject = METADATA_FORM_INPUTS.RESSOURCE(0);
    // Arrange
    const formData = new FormData();
    formData.append(METADATA_FORM_INPUTS.ORGANIZATION_ID, "orgId");
    formData.append(METADATA_FORM_INPUTS.CONTRIBUTOR_ID, "contId");
    formData.append(METADATA_FORM_INPUTS.TITLE, "title");
    formData.append(METADATA_FORM_INPUTS.DESCRIPTION, "desc");
    formData.append(METADATA_FORM_INPUTS.TAGS, "tag1, tag2");
    formData.append(METADATA_FORM_INPUTS.CATEGORIES, "cat1");
    formData.append(METADATA_FORM_INPUTS.CATEGORIES, "cat2");
    formData.append(METADATA_FORM_INPUTS.HVD_CATEGORIES, "hvd1");
    formData.append(METADATA_FORM_INPUTS.URL, "http://example.com");
    formData.append(creatorObject.name, "author");
    formData.append(creatorObject.email, "mail@mail.com");
    formData.append(creatorObject.url, "http://example.com");
    formData.append(creatorObject.address.addressee, "addressee");
    formData.append(creatorObject.address.details, "details");
    formData.append(creatorObject.address.street, "street");
    formData.append(creatorObject.address.city, "city");
    formData.append(creatorObject.address.zip, "zip");
    formData.append(creatorObject.address.country, "country");
    formData.append(resourcesObject.name, "resource0");
    formData.append(resourcesObject.url, "url");
    formData.append(resourcesObject.description, "desc");
    formData.append(resourcesObject.format, "format");
    formData.append(resourcesObject.language, "language");
    formData.append(resourcesObject.licenseId, "licenseId");
    formData.append(
      resourcesObject.licenseAttributionByText,
      "licenseAttributionByText",
    );
    formData.append(resourcesObject.modified, "modified");
    formData.append(resourcesObject.availability, "availability");
    formData.append(resourcesObject.hvd, "on");
    formData.append(
      METADATA_FORM_INPUTS.POLICITICAL_GEOCODING_LEVEL,
      "policiticalGeocodingLevelURI",
    );
    formData.append(
      METADATA_FORM_INPUTS.POLICITICAL_GEOCODING,
      "policiticalGeocodingURI",
    );
    formData.append(METADATA_FORM_INPUTS.GEOCODING_TEXT, "geocodingText");
    formData.append(METADATA_FORM_INPUTS.SPATIAL, "spatial");
    formData.append(METADATA_FORM_INPUTS.LEGAL_BASIS_TEXT, "legalbasisText");
    formData.append(
      METADATA_FORM_INPUTS.TEMPORAL_COVERAGE_FROM,
      "temporalCoverageFrom",
    );
    formData.append(
      METADATA_FORM_INPUTS.TEMPORAL_COVERAGE_TO,
      "temporalCoverageTo",
    );
    formData.append(METADATA_FORM_INPUTS.PUBLISHED, "published");
    formData.append(
      METADATA_FORM_INPUTS.LAST_MODIFIED_DATE,
      "lastModifiedDate",
    );

    ["maintainer", "publisher", "originator"].forEach((role) => {
      const roleObject = METADATA_FORM_INPUTS.CONTACTS(
        role as MetaDataContactRole,
      );
      formData.append(roleObject.name, "");
      formData.append(roleObject.email, "");
      formData.append(roleObject.url, "");
      formData.append(roleObject.address.addressee, "");
      formData.append(roleObject.address.details, "");
      formData.append(roleObject.address.street, "");
      formData.append(roleObject.address.city, "");
      formData.append(roleObject.address.zip, "");
      formData.append(roleObject.address.country, "");
    });

    [1, 2].forEach((i) => {
      const resourcesObject = METADATA_FORM_INPUTS.RESSOURCE(i);
      formData.append(resourcesObject.name, "resource" + i);
      formData.append(resourcesObject.url, "");
      formData.append(resourcesObject.description, "");
      formData.append(resourcesObject.format, "");
      formData.append(resourcesObject.language, "");
      formData.append(resourcesObject.licenseId, "");
      formData.append(resourcesObject.licenseAttributionByText, "");
      formData.append(resourcesObject.modified, "");
      formData.append(resourcesObject.availability, "");
      formData.append(resourcesObject.hvd, "");
    });

    const result = convertMetadataFormData(formData);
    expect(result).toEqual({
      organizationId: "orgId",
      contributorId: "contId",
      title: "title",
      description: "desc",
      tags: "tag1, tag2",
      categories: ["cat1", "cat2"],
      hvd_categories: ["hvd1"],
      url: "http://example.com",
      contacts: {
        creator: {
          name: "author",
          email: "mail@mail.com",
          url: "http://example.com",
          address: {
            addressee: "addressee",
            details: "details",
            street: "street",
            city: "city",
            zip: "zip",
            country: "country",
          },
        },
        maintainer: {
          name: "",
          email: "",
          url: "",
          address: {
            addressee: "",
            details: "",
            street: "",
            city: "",
            zip: "",
            country: "",
          },
        },
        publisher: {
          name: "",
          email: "",
          url: "",
          address: {
            addressee: "",
            details: "",
            street: "",
            city: "",
            zip: "",
            country: "",
          },
        },
        originator: {
          name: "",
          email: "",
          url: "",
          address: {
            addressee: "",
            details: "",
            street: "",
            city: "",
            zip: "",
            country: "",
          },
        },
      },
      resources: [
        {
          name: "resource0",
          url: "url",
          description: "desc",
          format: "format",
          language: "language",
          licenseId: "licenseId",
          licenseAttributionByText: "licenseAttributionByText",
          modified: "modified",
          availability: "availability",
          hvd: true,
        },
        {
          name: "resource1",
          url: "",
          description: "",
          format: "",
          language: "",
          licenseId: "",
          licenseAttributionByText: "",
          modified: "",
          availability: "",
          hvd: false,
        },
        {
          name: "resource2",
          url: "",
          description: "",
          format: "",
          language: "",
          licenseId: "",
          licenseAttributionByText: "",
          modified: "",
          availability: "",
          hvd: false,
        },
      ],
      policiticalGeocodingLevelURI: "policiticalGeocodingLevelURI",
      policiticalGeocodingURI: "policiticalGeocodingURI",
      geocodingText: "geocodingText",
      spatial: "spatial",
      legalbasisText: "legalbasisText",
      temporalCoverageFrom: "temporalCoverageFrom",
      temporalCoverageTo: "temporalCoverageTo",
      published: "published",
      lastModifiedDate: "lastModifiedDate",
    });
  });
});
