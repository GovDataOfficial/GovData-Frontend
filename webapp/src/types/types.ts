export type NextJSSearchParams = {
  [key: string]: string | string[] | undefined;
};

export type PageConstructor<WithSlug = { slug: string }> = {
  params: WithSlug;
  searchParams: NextJSSearchParams;
};

export type SortOptions =
  | "relevance_asc"
  | "relevance_desc"
  | "lastmodification_asc"
  | "lastmodification_desc"
  | "title_asc"
  | "title_desc";

export const DefaultSortOption: SortOptions = "relevance_desc";
export const SortOptions: SortOptions[] = [
  "relevance_asc",
  "relevance_desc",
  "lastmodification_asc",
  "lastmodification_desc",
  "title_asc",
  "title_desc",
];

type KnownFilter =
  | "licence"
  | "openness"
  | "hvd"
  | "format"
  | "groups"
  | "dataservice"
  | "type"
  | "showcase_types"
  | "hvd_categories"
  | "sourceportal"
  | "tags"
  | "platforms"
  | "start"
  | "end"
  | "boundingbox";

export type CleanedActiveFilters = Partial<Record<KnownFilter, string[]>>;

export type FilterMap = {
  facetList: {
    docCount: number;
    name: string;
  }[];
};

export type RecordFilterMap = Partial<Record<KnownFilter, FilterMap>>;

export enum HitType {
  dataset = "dataset",
  showcase = "showcase",
  article = "article",
  blog = "blog",
}

export type BaseSearchResultHit = {
  id: string;
  name: string;
  title: string;
  content: string;
  type: HitType;
  lastModified: string;
  displayImage?: string;
  targetLink?: string;
};

export type MetadataSearchResultHit = BaseSearchResultHit & {
  metadataModified: string;
  created: string;
  hasHvd: boolean;
  resources?: MetadataResource[];
  contact?: string;
};

export type ShowcasesSearchResultHit = BaseSearchResultHit & {
  releaseDate: string;
  allShowcaseTypes: string[];
  metadataModified: string;
  resources?: string[];
  usedDatasets?: { id: string; name: string; url: string }[];
  platforms?: { id: string; name: string }[];
  ownerOrg?: string;
  groups?: { id: string; name: string }[];
  groupId?: number;
  articleId?: string;
};

export type UnknownSearchResultHit = BaseSearchResultHit &
  Partial<MetadataSearchResultHit> &
  Partial<ShowcasesSearchResultHit>;

export type SearchResultSuggestion = { name: string; score: number };

export type SearchResults<T extends BaseSearchResultHit> = {
  hitsTotal: number;
  hits: T[];
  scrollId: string;
  moreNextHitsAvailable: boolean;
  filterMap: RecordFilterMap;
  cleanedActiveFilters: CleanedActiveFilters;
  suggestions: SearchResultSuggestion[];
  /* amount of hits for load more */
  pageSize: number;
};

export type LoadMoreResults<T extends BaseSearchResultHit> = {
  hits: T[];
  scrollId: string;
};

export type StateList = {
  id: string;
  name: string;
}[];

export type CategoriesSorted = {
  name: string;
  displayName: string;
  title: string;
  count: number;
  type: "group";
}[];

export type LicenseActiveSorted = {
  id: string;
  title: string;
  url: string;
}[];

export type OrganizationSorted = {
  id: string;
  name: string;
  displayName: string;
  title: string;
  contributorIds: string[];
}[];

export type ResourceFormatsSorted = string[];

export type MetadataQuality = {
  name: string;
  publisher: string;
  publisherDisplayName?: string;
  date: string;
  total_count: number;
  data: number[];
  data_percent: number[];
  labels: string[];
};

export type MetadataResourceLicense = {
  id: string;
  title?: string;
  url?: string;
  odConformance?: "approved";
  osdConformance?: "approved";
  open?: boolean;
  active?: boolean;
};

export type MetadataResource = {
  id: string;
  name: string;
  nameOnlyText: string;
  description: string;
  descriptionOnlyText: string;
  url: string;
  format: string;
  formatShort: string;
  language: string[];
  issued: string;
  modified: string;
  license?: MetadataResourceLicense;
  open: boolean;
  licenseAttributionByText: string;
  plannedAvailability: string;
  availability: string;
  availabilityDisplay: string;
  shortendAvailability?:
    | "STABLE"
    | "EXPERIMENTAL"
    | "TEMPORARY"
    | "AVAILABLE"
    | "OP_DATPRO";
  accessServices: {
    description: string;
    title: string;
    endpointUrls: string[];
    endpointDescription: string;
    servesDataset: string[];
    license: MetadataResourceLicense;
    licenseAttributionByText: string;
    availability: string;
    shortendAvailability: string;
    accessRights?: string;
    open: boolean;
  }[];
  hvd: boolean;
};

export enum MetadataContactRole {
  creator = "CREATOR",
  maintainer = "MAINTAINER",
  publisher = "PUBLISHER",
  originator = "ORIGINATOR",
}

export type MetadataContact = {
  name: string;
  email?: string;
  url: string;
  address?: Partial<{
    addressee: string;
    details: string;
    street: string;
    city: string;
    zip: string;
    country: string;
  }>;
  role: MetadataContactRole;
};

export type Metadata = {
  id: string;
  title: string;
  type: string;
  name: string;
  notes: string;
  url: string;
  resources: MetadataResource[];
  notAvailableResourceLinks?: string[];
  tags: string[];
  contacts: MetadataContact[];
  averageRating: number;
  categories: string[];
  documentation?: string[];
  lastModifiedDate: string;
  temporalCoverageFrom?: string;
  temporalCoverageTo?: string;
  owner_org: string;
  creator_user_id: string;
  open: boolean;
  geocodingText?: string[];
  contributorID?: string[];
  legalbasisText: string[];
  politicalGeocodingURI: string[];
  policiticalGeocodingLevelURI: string;
  spatial: string;
  qualityProcessURI: string;
  resourcesLicenses: {
    id: string;
    title: string;
    url: string;
    odConformance: "approved";
    osdConformance: "approved";
    open: boolean;
    active: boolean;
  }[];
  state: "active";
  hvdCategories?: Array<"MET" | "GEO" | "CCO" | "EOE" | "MOB" | "STA">;
  applicableLegislation: string[];
  hvd: boolean;
  private: boolean;
  published?: string;
};

export type ShowcaseContact = {
  name: string;
  email: string;
  website: string;
  addressReceiver: string;
  addressExtras: string;
  addressStreet: string;
  addressCity: string;
  addressPostalCode: string;
  addressCountry: string;
};

export type ShowcaseImage = { imageOrderId: number; image: string };

export type ShowcaseData = {
  id: number;
  title: string;
  notes: string;
  contact?: ShowcaseContact;
  showcaseTypes: string[];
  images: ShowcaseImage[];
  linksToShowcase: { id: number; name: string; url: string }[];
  usedDatasets: { id: number; name: string; url: string }[];
  platforms: string[];
  linkToSourcesUrl?: string;
  linkToSourcesName?: string;
  categories: string[];
  keywords: string[];
  website?: string;
  manualShowcaseCreatedDate: number;
  manualShowcaseModifiedDate: number;
  usecasePublisher?: string;
  usecaseSourceUrl?: string;
  creatorUserId: string;
  modifyDate: number;
  hidden: boolean;
  createDate: number;
  spatial: string;
};

export enum ShowcaseFormLinkType {
  usecase = "usecase",
  linksToShowcase = "linksToShowcase",
  usedDatasets = "usedDatasets",
  linkToSources = "linkToSources",
}

export type PortalNumbers = {
  hvdDatasets: number;
  filterMap: {
    type: FilterMap;
  };
};

export type PostDto = {
  text: string;
  id: string;
  url: string;
  name: string;
  username: string;
  timestamp: string;
  type: string;
  isRetweet: boolean;
  retweet: boolean;
};

export type MappedSuggest = {
  id: string | number;
  display_name: string;
  boundingbox: any[];
  type?: string;
};

export type boundingBoxNumberCoordinates = [number, number, number, number];
export type boundingBoxStringCoordinates = [string, string, string, string];

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export enum ResourceFormatShort {
  geojson = "geojson",
}

export enum ProjectionName {
  EPSG4326 = "EPSG:4326",
  EPSG3857 = "EPSG:3857",
}
