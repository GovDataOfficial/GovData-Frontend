import { Agent } from "undici";

import { convertToURLSearchParams } from "@/app/_lib/convertToSearchParams";
import { FILTERS, SPECIAL_FILTERS } from "@/app/_lib/URLHelper";
import { logger } from "@/logger/logger";
import {
  CategoriesSorted,
  DefaultSortOption,
  LicenseActiveSorted,
  Metadata,
  MetadataQuality,
  MetadataSearchResultHit,
  NextJSSearchParams,
  OrganizationSorted,
  PortalNumbers,
  PostDto,
  ResourceFormatsSorted,
  SearchResults,
  ShowcaseData,
  ShowcasesSearchResultHit,
  StateList,
  UnknownSearchResultHit,
} from "@/types/types";
import { T3Page } from "@/types/types.typo3";

const log = logger("getData.ts");

const credentials = `${process.env.BE_GD_AUTH_USER}:${process.env.BE_GD_AUTH_PASSWORD}`;
const encodedCredentials = Buffer.from(credentials).toString("base64");
export const authHeader = `Basic ${encodedCredentials}`;

// relax typo3 fetch calls
const typo3FetchAgentDispatcher = new Agent({
  connect: { rejectUnauthorized: false },
});

//TODO: Move file to more specific folder

/**
 * Convenience Fetch Method to retrieve data from typo3 and microservices.
 * ⚠ Currently caching is disabled.
 *   Every page load will therefore create a new call to typo3/microservices.
 *   Caching needs still to be implemented.
 *   see:
 *   - https://nextjs.org/docs/app/building-your-application/caching#data-cache
 *   - https://nextjs.org/docs/app/api-reference/functions/fetch
 **/
export function fetchData<T>(
  url?: string,
  opts?: {},
  parseAsText: boolean = false,
) {
  log.debug(`GET ${url}`);
  if (!url) {
    log.error("no url provided");
    return undefined;
  }

  return fetch(url, { ...opts })
    .then((r) => {
      if (r.ok) {
        // Handle 204 No Content and any other status that might not have a body
        if (r.status === 204 || r.headers.get("Content-Length") === "0") {
          return undefined;
        }

        if (parseAsText) {
          return r.text() as T;
        }

        // Check if there's a content type header indicating JSON
        const contentType = r.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          return r.json() as T;
        }

        throw new Error(
          "Expected JSON response but received different content type",
        );
      }
      throw new Error(`GET ${url} failed with status ${r.status}`);
    })
    .catch((e) => {
      log.error(e);
      return undefined;
    });
}

export function fetchMicroData<T>(url?: string, parseAsText: boolean = false) {
  return fetchData<T>(
    url,
    {
      headers: {
        Authorization: authHeader,
      },
    },
    parseAsText,
  );
}

export function fetchTypo3Data(typo3Url: string) {
  return fetchData<T3Page>(`${process.env.be_typo3_url}${typo3Url}`, {
    dispatcher: typo3FetchAgentDispatcher,
  });
}

export function fetchStateList() {
  return fetchMicroData<StateList>(`${process.env.be_gd_data_url}/states`);
}

export function fetchCategoriesSorted() {
  return fetchMicroData<CategoriesSorted>(
    `${process.env.be_gd_data_url}/category-sorted`,
  );
}

export function fetchLicenseActiveSorted() {
  return fetchMicroData<LicenseActiveSorted>(
    `${process.env.be_gd_data_url}/license-active-sorted`,
  );
}

export function fetchMetadata(nameOrId: string) {
  return fetchMicroData<Metadata>(
    `${process.env.be_gd_data_url}/metadata/${nameOrId}`,
  );
}

export function fetchOrganizationSorted() {
  return fetchMicroData<OrganizationSorted>(
    `${process.env.be_gd_data_url}/organization-sorted`,
  );
}

export function fetchResourceFormatsSorted() {
  return fetchMicroData<ResourceFormatsSorted>(
    `${process.env.be_gd_data_url}/resource-formats-sorted`,
  );
}

export function fetchSearchSuggestions(q: string) {
  return fetchMicroData(
    `${process.env.be_index_app2_url}/search/seach-suggestions/${q}`,
  );
}

export function fetchSearchScrollResults(scrollId: string) {
  return fetchMicroData<SearchResults<UnknownSearchResultHit>>(
    `${process.env.be_index_app2_url}/search/scroll/${scrollId}`,
  );
}

export function fetchGeocodingSuggest(sessionId: string, q: string) {
  if (sessionId && q && process.env.BE_GD_DATA_SEARCHMAP_GEOSEARCH_URL) {
    const geocodingUrl = process.env.BE_GD_DATA_SEARCHMAP_GEOSEARCH_URL.replace(
      "sessionID",
      sessionId,
    );
    return fetchData(geocodingUrl + q);
  }
}

export function fetchOSMSuggest(q: string) {
  return fetchData(process.env.BE_GD_DATA_SEARCHMAP_OSMSEARCH_URL + q);
}

export function fetchSearchMapSessionId() {
  return fetchMicroData<string>(
    `${process.env.be_gd_data_url}/searchmap-sessionid`,
    true,
  );
}

export function fetchMetadataQuality() {
  return fetchMicroData<MetadataQuality[]>(
    `${process.env.be_gd_data_url}/metadata-quality-metrics`,
  );
}

export function fetchShowcase(id: string) {
  return fetchMicroData<ShowcaseData>(
    `${process.env.be_gd_db_url}/showcase/${id}`,
  );
}

// this currently fetches the complete information about a showcase,
// but we only need the title and id. this should be refactored.
export function fetchDataSetShowCaseConnection(id: string) {
  const param =
    "?page=0" +
    "&pageSize=50" +
    "&sortProperty=title" +
    "&asc=asc" +
    `&searchKey=${id}` +
    "&searchColumns=usedDatasets.url";
  return fetchMicroData<{ items: { id: number; title: string }[] }>(
    `${process.env.be_gd_db_url}/showcase${param}`,
  );
}

export function fetchPortalNumbers() {
  return fetchMicroData<PortalNumbers>(
    process.env.be_gd_data_url + "/portal-numbers",
  );
}

export function fetchMastodonData() {
  return fetchMicroData<PostDto>(process.env.be_gd_data_url + "/mastodon-post");
}

export function getSearchResults(searchParams: NextJSSearchParams) {
  const params = convertToURLSearchParams(searchParams);
  const toSend = new URL(`${process.env.be_index_app2_url}/search/search`);

  const appendIfAvailable = (p: string | null, f: string) => {
    p && toSend.searchParams.append(f, p);
  };

  // single 'special filters'
  appendIfAvailable(params.get(SPECIAL_FILTERS.QUERY), "queryString");
  appendIfAvailable(params.get(SPECIAL_FILTERS.TYPE), "type");
  appendIfAvailable(params.get(SPECIAL_FILTERS.BOUNDING_BOX), "boundingbox");
  appendIfAvailable(params.get(SPECIAL_FILTERS.START), "dateFrom");
  appendIfAvailable(params.get(SPECIAL_FILTERS.END), "dateUntil");

  const allFilters = Object.values(FILTERS)
    .map((filter) => params.getAll(filter).map((key) => filter + ":" + key))
    .flat()
    .join("|");

  appendIfAvailable(allFilters, "activeFilters");

  const sortParam = params.get(SPECIAL_FILTERS.SORT) || DefaultSortOption;

  const [type, order] = sortParam.split("_");
  toSend.searchParams.set("sortType", type);
  toSend.searchParams.set("ascending", order === "asc" ? "true" : "false");

  return fetchMicroData<SearchResults<UnknownSearchResultHit>>(
    toSend.toString(),
  );
}

export function fetchOrganizationsForUser(username?: string) {
  if (!username) {
    return undefined;
  }
  return fetchMicroData<OrganizationSorted>(
    `${process.env.be_gd_data_url}/organization-for-editor-user?username=${username}`,
  );
}

export async function fetchMetadataForOrganizations(
  organizations?: OrganizationSorted,
) {
  if (!organizations) {
    return undefined;
  }

  const toSend = new URL(`${process.env.be_index_app2_url}/search/search`);
  toSend.searchParams.set(
    "activeFilters",
    "onlyEditorMetadata:hidePrivateDataset",
  );

  //result is subsequently sorted on the client-side within the MetadataOverviewContainer component
  toSend.searchParams.set("sortType", FILTERS.LAST_MODIFICATION);
  toSend.searchParams.set("ascending", "false");
  toSend.searchParams.set("numResults", "3000");

  organizations.forEach((org) => {
    toSend.searchParams.append("editorOrganizationIdList", org.id);
  });

  return fetchMicroData<SearchResults<MetadataSearchResultHit>>(
    toSend.toString(),
  );
}

export async function fetchShowcases() {
  const toSend = new URL(`${process.env.be_index_app2_url}/search/search`);
  toSend.searchParams.set("type", "showcase");

  //result is subsequently sorted on the client-side within the ShowcasesOverviewContainer component
  toSend.searchParams.set("sortType", FILTERS.LAST_MODIFICATION);
  toSend.searchParams.set("ascending", "false");
  toSend.searchParams.set("numResults", "3000");

  return fetchMicroData<SearchResults<ShowcasesSearchResultHit>>(
    toSend.toString(),
  );
}
