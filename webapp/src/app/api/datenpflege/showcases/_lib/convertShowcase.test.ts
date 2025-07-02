import { describe, expect, it } from "vitest";

import { convertShowcaseFormData } from "@/app/api/datenpflege/showcases/_lib/convertShowcase";
import { SHOWCASE_FORM_INPUTS } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/showcase-formConstants";
import { ShowcaseFormLinkType } from "@/types/types";

describe("Convert showcase data", () => {
  it("should convert showcase form data to json", () => {
    // Arrange
    const formData = new FormData();
    formData.append(SHOWCASE_FORM_INPUTS.TITLE, "title");
    formData.append(SHOWCASE_FORM_INPUTS.NOTES, "notes");
    formData.append(SHOWCASE_FORM_INPUTS.KEYWORDS, "keyword1, keyword2");
    formData.append(SHOWCASE_FORM_INPUTS.CATEGORIES, "cat1");
    formData.append(SHOWCASE_FORM_INPUTS.CATEGORIES, "cat2");
    formData.append(SHOWCASE_FORM_INPUTS.SPATIAL, "spatial");
    formData.append(SHOWCASE_FORM_INPUTS.CREATED_DATE, "2020-09-01");
    formData.append(SHOWCASE_FORM_INPUTS.MODIFIED_DATE, "2020-09-02");
    formData.append(SHOWCASE_FORM_INPUTS.PLATFORMS, "platform1");
    formData.append(SHOWCASE_FORM_INPUTS.PLATFORMS, "platform2");
    formData.append(SHOWCASE_FORM_INPUTS.SHOWCASE_TYPES, "showcaseType1");
    formData.append(SHOWCASE_FORM_INPUTS.SHOWCASE_TYPES, "showcaseType2");

    formData.append(SHOWCASE_FORM_INPUTS.CONTACT.name, "a contact");
    formData.append(SHOWCASE_FORM_INPUTS.CONTACT.email, "mail@mail.com");
    formData.append(SHOWCASE_FORM_INPUTS.CONTACT.website, "http://example.com");
    formData.append(SHOWCASE_FORM_INPUTS.CONTACT.addressReceiver, "addressee");
    formData.append(SHOWCASE_FORM_INPUTS.CONTACT.addressExtras, "details");
    formData.append(SHOWCASE_FORM_INPUTS.CONTACT.addressStreet, "street");
    formData.append(SHOWCASE_FORM_INPUTS.CONTACT.addressCity, "city");
    formData.append(SHOWCASE_FORM_INPUTS.CONTACT.addressPostalCode, "zip");
    formData.append(SHOWCASE_FORM_INPUTS.CONTACT.addressCountry, "country");

    const usecaseLink = SHOWCASE_FORM_INPUTS.LINK(ShowcaseFormLinkType.usecase);
    formData.append(usecaseLink.name, "usecasePublisher");
    formData.append(usecaseLink.url, "usecaseSourceUrl");

    const linkToSources = SHOWCASE_FORM_INPUTS.LINK(
      ShowcaseFormLinkType.linkToSources,
    );
    formData.append(linkToSources.name, "linkToSourcesName");
    formData.append(linkToSources.url, "linkToSourcesUrl");

    const linksToShowcases1 = SHOWCASE_FORM_INPUTS.LINK(
      ShowcaseFormLinkType.linksToShowcase,
      "1",
    );
    formData.append(linksToShowcases1.name, "linkToShowcasesName1");
    formData.append(linksToShowcases1.url, "linkToShowcasesUrl1");

    const linksToShowcases2 = SHOWCASE_FORM_INPUTS.LINK(
      ShowcaseFormLinkType.linksToShowcase,
      "2",
    );
    formData.append(linksToShowcases2.name, "linkToShowcasesName2");
    formData.append(linksToShowcases2.url, "linkToShowcasesUrl2");

    const usedDatasets1 = SHOWCASE_FORM_INPUTS.LINK(
      ShowcaseFormLinkType.usedDatasets,
      "1",
    );
    formData.append(usedDatasets1.name, "usedDatasetsName1");
    formData.append(usedDatasets1.url, "usedDatasetsUrl1");

    const usedDatasets2 = SHOWCASE_FORM_INPUTS.LINK(
      ShowcaseFormLinkType.usedDatasets,
      "2",
    );
    formData.append(usedDatasets2.name, "usedDatasetsName2");
    formData.append(usedDatasets2.url, "usedDatasetsUrl2");

    formData.append(
      `${SHOWCASE_FORM_INPUTS.IMAGE}2`,
      "data:image/png;base64,image2",
    );

    const result = convertShowcaseFormData(formData);
    expect(result).toEqual({
      title: "title",
      notes: "notes",
      keywords: ["keyword1", "keyword2"],
      categories: ["cat1", "cat2"],
      platforms: ["platform1", "platform2"],
      showcaseTypes: ["showcaseType1", "showcaseType2"],
      manualShowcaseCreatedDate: "2020-09-01",
      manualShowcaseModifiedDate: "2020-09-02",
      spatial: "spatial",
      usecasePublisher: "usecasePublisher",
      usecaseSourceUrl: "usecaseSourceUrl",
      linkToSourcesName: "linkToSourcesName",
      linkToSourcesUrl: "linkToSourcesUrl",
      linksToShowcase: [
        { name: "linkToShowcasesName1", url: "linkToShowcasesUrl1" },
        { name: "linkToShowcasesName2", url: "linkToShowcasesUrl2" },
      ],
      usedDatasets: [
        { name: "usedDatasetsName1", url: "usedDatasetsUrl1" },
        { name: "usedDatasetsName2", url: "usedDatasetsUrl2" },
      ],
      contact: {
        name: "a contact",
        email: "mail@mail.com",
        website: "http://example.com",
        addressReceiver: "addressee",
        addressExtras: "details",
        addressStreet: "street",
        addressCity: "city",
        addressPostalCode: "zip",
        addressCountry: "country",
      },
      images: [{ imageOrderId: 2, image: "image2" }],
    });
  });
});
