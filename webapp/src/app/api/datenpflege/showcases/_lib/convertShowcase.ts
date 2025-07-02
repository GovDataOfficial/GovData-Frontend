import { SHOWCASE_FORM_INPUTS } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/showcase-formConstants";
import { ShowcaseFormLinkType } from "@/types/types";

const extractContactData = (formData: FormData) => {
  return {
    name: formData.get(SHOWCASE_FORM_INPUTS.CONTACT.name),
    email: formData.get(SHOWCASE_FORM_INPUTS.CONTACT.email),
    website: formData.get(SHOWCASE_FORM_INPUTS.CONTACT.website),
    addressReceiver: formData.get(SHOWCASE_FORM_INPUTS.CONTACT.addressReceiver),
    addressExtras: formData.get(SHOWCASE_FORM_INPUTS.CONTACT.addressExtras),
    addressStreet: formData.get(SHOWCASE_FORM_INPUTS.CONTACT.addressStreet),
    addressCity: formData.get(SHOWCASE_FORM_INPUTS.CONTACT.addressCity),
    addressPostalCode: formData.get(
      SHOWCASE_FORM_INPUTS.CONTACT.addressPostalCode,
    ),
    addressCountry: formData.get(SHOWCASE_FORM_INPUTS.CONTACT.addressCountry),
  };
};

const extractLinksForType = (
  formData: FormData,
  linkType: ShowcaseFormLinkType,
) => {
  const links = [];
  let i = 1;
  let formInputs = SHOWCASE_FORM_INPUTS.LINK(linkType, i.toString());
  while (formData.has(formInputs.url) || formData.has(formInputs.name)) {
    const linkInfo = {
      name: formData.get(formInputs.name),
      url: formData.get(formInputs.url),
    };
    if (linkInfo.name || linkInfo.url) {
      links.push(linkInfo);
    }
    i++;
    formInputs = SHOWCASE_FORM_INPUTS.LINK(linkType, i.toString());
  }
  return links;
};

const extractLinks = (formData: FormData) => {
  const result: Record<string, any> = {};
  result["usecasePublisher"] = formData.get(
    SHOWCASE_FORM_INPUTS.LINK(ShowcaseFormLinkType.usecase).name,
  );
  result["usecaseSourceUrl"] = formData.get(
    SHOWCASE_FORM_INPUTS.LINK(ShowcaseFormLinkType.usecase).url,
  );

  result["linkToSourcesName"] = formData.get(
    SHOWCASE_FORM_INPUTS.LINK(ShowcaseFormLinkType.linkToSources).name,
  );
  result["linkToSourcesUrl"] = formData.get(
    SHOWCASE_FORM_INPUTS.LINK(ShowcaseFormLinkType.linkToSources).url,
  );

  result["linksToShowcase"] = extractLinksForType(
    formData,
    ShowcaseFormLinkType.linksToShowcase,
  );
  result["usedDatasets"] = extractLinksForType(
    formData,
    ShowcaseFormLinkType.usedDatasets,
  );

  return result;
};

export const extractKeywords = (formData: FormData) => {
  const tags = formData.get(SHOWCASE_FORM_INPUTS.KEYWORDS) as string;
  return tags ? tags.split(",").map((tag: string) => tag.trim()) : [];
};

const extractImageData = (formData: FormData) => {
  const images = [];

  for (let i = 1; i <= 5; i++) {
    const formInput = SHOWCASE_FORM_INPUTS.IMAGE + i.toString();
    if (formData.has(formInput)) {
      const base64Image = formData.get(formInput) as string;
      const imageInfo = {
        imageOrderId: i,
        // The prefix es handled by the backend so we need to remove it here
        image: base64Image.replace(/^data:image\/\w+;base64,/, ""),
      };
      images.push(imageInfo);
    }
  }
  return images;
};

export function convertShowcaseFormData(
  formData: FormData,
): Record<string, any> {
  let result: Record<string, any> = {};

  formData.forEach((value, key) => {
    if (
      !key.includes("contact") &&
      !key.includes("links") &&
      !key.includes(SHOWCASE_FORM_INPUTS.CATEGORIES) &&
      !key.includes(SHOWCASE_FORM_INPUTS.PLATFORMS) &&
      !key.includes(SHOWCASE_FORM_INPUTS.SHOWCASE_TYPES) &&
      !key.includes(SHOWCASE_FORM_INPUTS.IMAGE)
    ) {
      result[key] = value.toString();
    }
  });

  result[SHOWCASE_FORM_INPUTS.CATEGORIES] = formData.getAll(
    SHOWCASE_FORM_INPUTS.CATEGORIES,
  );
  result[SHOWCASE_FORM_INPUTS.PLATFORMS] = formData.getAll(
    SHOWCASE_FORM_INPUTS.PLATFORMS,
  );
  result[SHOWCASE_FORM_INPUTS.SHOWCASE_TYPES] = formData.getAll(
    SHOWCASE_FORM_INPUTS.SHOWCASE_TYPES,
  );
  const linkData = extractLinks(formData);
  result = { ...result, ...linkData };
  result["contact"] = extractContactData(formData);
  result[SHOWCASE_FORM_INPUTS.KEYWORDS] = extractKeywords(formData);

  const imageData = extractImageData(formData);
  result = { ...result, ...{ images: imageData } };

  return result;
}
