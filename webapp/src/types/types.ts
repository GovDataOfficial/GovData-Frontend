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

// TODO differentiate between resulthits for datasets and showcases
export type SearchResultHit = {
  id: string;
  name: string;
  lastModified: string;
  title: string;
  content: string;
  type: string;
  primaryShowcaseType?: string;
  hasHvd: boolean;
  resources?: MetaDataResource[];
  displayImage?: string;
  targetLink?: string;
  contact?: string;
};

export type SearchResultSuggestion = { name: string; score: number };

export type SearchResults = {
  hitsTotal: number;
  hits: SearchResultHit[];
  scrollId: string;
  moreNextHitsAvailable: boolean;
  filterMap: RecordFilterMap;
  cleanedActiveFilters: CleanedActiveFilters;
  suggestions: SearchResultSuggestion[];
  /* amount of hits for load more */
  pageSize: number;
};

export type LoadMoreResults = {
  hits: SearchResultHit[];
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
}[];

export type ResourceFormatsSorted = string[];

export type MetaDataQuality = {
  name: string;
  publisher: string;
  publisherDisplayName?: string;
  date: string;
  total_count: number;
  data: number[];
  data_percent: number[];
  labels: string[];
};

export type MetaDataResourceLicense = {
  id: string;
  title?: string;
  url?: string;
  odConformance?: "approved";
  osdConformance?: "approved";
  open?: boolean;
  active?: boolean;
};

export type MetaDataResource = {
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
  license?: MetaDataResourceLicense;
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
    license: MetaDataResourceLicense;
    licenseAttributionByText: string;
    availability: string;
    shortendAvailability: string;
    accessRights?: string;
    open: boolean;
  }[];
  hvd: boolean;
};

export type MetaData = {
  id: string;
  title: string;
  type: string;
  name: string;
  notes: string;
  url: string;
  resources: MetaDataResource[];
  notAvailableResourceLinks?: string[];
  tags: {
    name: string;
    count: number;
    description: string;
  }[];
  contacts: {
    name: string;
    url: string;
    address: {};
    email?: string;
    role: "PUBLISHER" | "MAINTAINER";
  }[];
  averageRating: number;
  categories: {
    name: string;
    displayName: string;
    title: string;
    count: number;
    description: string;
  }[];
  lastModifiedDate: string;
  temporalCoverageFrom?: string;
  temporalCoverageTo?: string;
  owner_org: string;
  creator_user_id: string;
  open: boolean;
  geocodingText?: string[];
  contributorID: string[];
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
  hvdCategories?: Array<"MET" | "GEO">;
  applicableLegislation: string[];
  hvd: boolean;
  private: boolean;
  published?: string;
};

export type ShowCaseData = {
  id: number;
  title: string;
  notes: string;
  contact?: {
    id: number;
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
  showcaseTypes: { id: number; name: string; primaryShowcase: boolean }[];
  images: { id: number; imageOrderId: number; image: string }[];
  linksToShowcase: { id: number; name: string; url: string }[];
  usedDatasets: { id: number; name: string; url: string }[];
  platforms: { id: number; name: string }[];
  linkToSourcesUrl?: string;
  linkToSourcesName?: string;
  categories: { id: number; name: string }[];
  keywords: { id: number; name: string }[];
  website?: string;
  manualShowcaseCreatedDate: number;
  usecasePublisher?: string;
  usecaseSourceUrl?: string;
  creatorUserId: string;
  modifyDate: number;
  hidden: boolean;
  createDate: number;
};

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
