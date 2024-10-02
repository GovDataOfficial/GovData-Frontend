import {
  CategoriesSorted,
  DefaultSortOption,
  LicenseActiveSorted,
  MetaData,
  MetaDataQuality,
  NextJSSearchParams,
  OrganizationSorted,
  PortalNumbers,
  PostDto,
  ResourceFormatsSorted,
  SearchResults,
  ShowCaseData,
  StateList,
} from "@/types/types";
import { headers } from "next/headers";
import { T3Page } from "@/types/types.typo3";
import { convertToURLSearchParams } from "@/app/_lib/convertToSearchParams";
import { FILTERS, SPECIAL_FILTERS } from "@/app/_lib/URLHelper";
import { Agent } from "undici";

const credentials = `${process.env.BE_GD_AUTH_USER}:${process.env.BE_GD_AUTH_PASSWORD}`;
const encodedCredentials = Buffer.from(credentials).toString("base64");
const authHeader = `Basic ${encodedCredentials}`;

// relax typo3 fetch calls
const typo3FetchAgentDispatcher = new Agent({
  connect: { rejectUnauthorized: false },
});

/**
 * Convenience Fetch Method to retrieve data from typo3 and microservices.
 * ⚠ Currently caching is disabled because we use headers() in fetch method.
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
  const headersList = headers();
  if (process.env.LOG_LEVEL === "debug") {
    console.debug(
      `[${new Date().toISOString()}][${headersList.get("x-request-id")}] fetching ${url}`,
    );
  }

  if (!url) {
    console.error("no url provided");
    return undefined;
  }

  return fetch(url, opts)
    .then((r) => {
      if (r.status === 200) {
        if (parseAsText) {
          return r.text() as T;
        }
        return r.json() as T;
      } else {
        r.text().then((error) => console.error(error));
      }
    })
    .catch((e) => {
      console.debug(e);
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
  return fetchData<T3Page>(process.env.BE_TYPO3_URL + typo3Url, {
    dispatcher: typo3FetchAgentDispatcher,
  });
}

export function fetchStateList() {
  return fetchMicroData<StateList>(process.env.BE_GD_DATA_STATES_URL);
}

export function fetchCategoriesSorted() {
  return fetchMicroData<CategoriesSorted>(
    process.env.BE_GD_DATA_CATEGORIES_SORTED_URL,
  );
}
export function fetchLicenseActiveSorted() {
  return fetchMicroData<LicenseActiveSorted>(
    process.env.BE_GD_DATA_LICENSE_ACTIVE_SORTED,
  );
}

export function fetchMetadata(name: string) {
  return fetchMicroData<MetaData>(
    process.env.BE_GD_DATA_META_DATA + "?name=" + name,
  );
}

export function fetchOrganizationSorted() {
  return fetchMicroData<OrganizationSorted>(
    process.env.BE_GD_DATA_ORGANIZATION_SORTED,
  );
}

export function fetchResourceFormatsSorted() {
  return fetchMicroData<ResourceFormatsSorted>(
    process.env.BE_GD_DATA_RESOURCE_FORMATS_SORTED,
  );
}

export function fetchSearchSuggestions(q: string) {
  return fetchMicroData(process.env.BE_GD_DATA_SEARCH_SUGGEST + "/" + q);
}

export function fetchSearchScrollResults(scrollId: string) {
  return fetchMicroData<SearchResults>(
    process.env.BE_GD_SEARCH_SCROLL_URL + `/${scrollId}`,
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
    process.env.BE_GD_DATA_SEARCHMAP_SESSION_ID!,
    true,
  );
}

export function fetchMetaDataQuality() {
  return fetchMicroData<MetaDataQuality[]>(process.env.BE_GD_DATA_META_QUALITY);
}

export function fetchShowCase(id: string) {
  return fetchMicroData<ShowCaseData>(
    process.env.BE_GD_DATA_SHOWCASE + `/${id}`,
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
    process.env.BE_GD_DATA_SHOWCASE + param,
  );
}

export function fetchPortalNumbers() {
  return fetchMicroData<PortalNumbers>(process.env.BE_GD_DATA_NUMBERS);
}

export function fetchMastodonData() {
  return fetchMicroData<PostDto>(process.env.BE_GD_DATA_MASTADON);
}

export function getSearchResults(searchParams: NextJSSearchParams) {
  const params = convertToURLSearchParams(searchParams);
  const toSend = new URL(process.env.BE_GD_SEARCH_URL!);

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
    .join(",");

  appendIfAvailable(allFilters, "activeFilters");

  const sortParam = params.get(SPECIAL_FILTERS.SORT) || DefaultSortOption;

  const [type, order] = sortParam.split("_");
  toSend.searchParams.set("sortType", type);
  toSend.searchParams.set("ascending", order === "asc" ? "true" : "false");

  return fetchMicroData<SearchResults>(toSend.toString());
}
