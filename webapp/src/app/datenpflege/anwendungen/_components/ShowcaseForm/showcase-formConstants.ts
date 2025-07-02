import { ShowcaseFormLinkType } from "@/types/types";

export const SHOWCASE_FORM_ID = "showcase-form";

export const SHOWCASE_FORM_MAX_LENGTH_LONG = 10000;
export const SHOWCASE_FORM_MAX_LENGTH_MEDIUM = 1000;
export const SHOWCASE_FORM_MAX_LENGTH_SMALL = 255;

export const MAX_SHOWCASE_LINKS_COUNT = 60;

export const SHOWCASE_FORM_INPUTS = {
  ID: "id",
  TITLE: "title",
  NOTES: "notes",
  SHOWCASE_TYPES: "showcaseTypes",
  PLATFORMS: "platforms",
  CATEGORIES: "categories",
  KEYWORDS: "keywords",
  CREATED_DATE: "manualShowcaseCreatedDate",
  MODIFIED_DATE: "manualShowcaseModifiedDate",
  SPATIAL: "spatial",
  LINK: (type: ShowcaseFormLinkType, linkName?: string) => ({
    name: `links[${type}]${linkName ? `.[${linkName}]` : ""}.name`,
    url: `links[${type}]${linkName ? `.[${linkName}]` : ""}.url`,
  }),
  CONTACT: {
    name: `contact.name`,
    email: `contact.email`,
    website: `contact.website`,
    addressReceiver: `contact.addressReceiver`,
    addressExtras: `contact.addressExtras`,
    addressStreet: `contact.addressStreet`,
    addressCity: `contact.addressCity`,
    addressPostalCode: `contact.addressPostalCode`,
    addressCountry: `contact.addressCountry`,
  },
  IMAGE: "image-",
} as const;

export enum ShowcaseFormStepName {
  cotents = "contents",
  links = "links",
  contact = "contact",
}
