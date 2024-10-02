import { NextRequest, NextResponse } from "next/server";
import { PAGES, SPECIAL_FILTERS } from "@/app/_lib/URLHelper";
import { MiddlewareFactory } from "@/middlewares/types";

/**
 * Get sort from /s/...
 */
function getSortFromLegacyPath(path: string): string | undefined {
  const match = path.match(/s\/([^\/]+)/);
  return match ? match[1] : undefined;
}

/**
 * Get filter from /f/...
 * filter are in form "key:value,key:value"
 */
function getFilterFromLegacyPath(path: string): string[][] | undefined {
  const match = path.match(/f\/([^\/]+)/);
  if (match && match[1]) {
    const decodedString = decodeURIComponent(match[1]);
    return decodedString
      .split(",")
      .filter((f) => f)
      .map((param) => {
        const [key, value] = param.split(":");
        // double decode here because old liferay system had double encoding for some params
        return [key, decodeURIComponent(decodeURIComponent(value))];
      });
  }
  return undefined;
}

/**
 * Get the query from /q/...
 */
function getQueryFromLegacyPath(path: string): string | undefined {
  const match = path.match(/q\/([^\/]+)/);
  return match ? match[1] : undefined;
}

/**
 * Get the boundingbox from /boundingbox/....
 * Need to decode the string as it contains ',' to seperate geodata
 */
function getBoundingBoxFromLegacyPath(path: string): string | undefined {
  const match = path.match(/boundingbox\/([^\/]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Format Date from DD.MM.YYYY to YYYY-MM-DD.
 * Cant simply use Date Constructor as DD.MM.YYYY is not a valid format.
 */
function formatLegacyDate(dateString: string): string {
  return dateString.split(".").reverse().join("-");
}

/**
 * Get the endDate from /start/DD.MM.YYYY
 */
function getStartDateFromLegacyPath(path: string): string | undefined {
  const match = path.match(/start\/([^\/]+)/);
  return match ? formatLegacyDate(match[1]) : undefined;
}

/**
 * Get the endDate from /end/DD.MM.YYYY
 */
function getEndDateFromLegacyPath(path: string): string | undefined {
  const match = path.match(/end\/([^\/]+)/);
  return match ? formatLegacyDate(match[1]) : undefined;
}

/**
 * Create UrlSearchParams from old legacy path style.
 */
function createSearchFromLegacyPath(path: string) {
  const query = getQueryFromLegacyPath(path);
  const sort = getSortFromLegacyPath(path);
  const filters = getFilterFromLegacyPath(path);
  const boundingBox = getBoundingBoxFromLegacyPath(path);
  const startDate = getStartDateFromLegacyPath(path);
  const endDate = getEndDateFromLegacyPath(path);

  const searchParams = new URLSearchParams();

  query && searchParams.set(SPECIAL_FILTERS.QUERY, query);

  filters?.forEach((f) => {
    searchParams.append(f[0], f[1]);
  });

  boundingBox && searchParams.set(SPECIAL_FILTERS.BOUNDING_BOX, boundingBox);
  sort && searchParams.set(SPECIAL_FILTERS.SORT, sort);
  startDate && searchParams.set(SPECIAL_FILTERS.START, startDate);
  endDate && searchParams.set(SPECIAL_FILTERS.END, endDate);
  return searchParams;
}

/**
 * redirect to search results page taking in all params into account.
 */
function redirectSearchResult(path: string): string {
  const searchParams = createSearchFromLegacyPath(path);
  const params = searchParams.toString();
  return params ? `${PAGES.search}?${params}` : PAGES.search;
}

/**
 * redirect to extended search taking in all params into account.
 */
function redirectExtendedSearch(path: string): string {
  const searchParams = createSearchFromLegacyPath(path);
  const params = searchParams.toString();
  return params ? `${PAGES.extendedSearch}?${params}` : PAGES.extendedSearch;
}

/**
 * redirect to detail or anwendung page depending on
 * whether the id is an int or string
 */
function redirectDetailsPage(path: string): string {
  const id = path.split("/").pop();
  const maybeNumber = id && parseInt(id);
  const isNumber = !Number.isNaN(maybeNumber);

  return isNumber
    ? `${PAGES.search_details_showcase}/${id}`
    : `${PAGES.search_details_dataset}/${id}`;
}

function redirectToInformationPage(path: string) {
  const lastPathPart = path.split("/").pop();
  return PAGES.information + `/${lastPathPart}`;
}

/**
 * Checks incoming requests for possible redirects if url is legacy style.
 */
function getRedirectPath(request: NextRequest): string | null {
  const path = request.nextUrl.pathname;
  // hardcoded path redirects
  switch (path) {
    case "/web/guest/daten":
      return "/daten";
    case "/web/guest/showroom":
      return "/suche?type=showcase";
    case "/web/guest/sparql-assistent":
      return "/sparql-assistent";
    case "/web/guest/kontakt":
      return "/kontakt";
    /* footer-pages */
    case "/web/guest/datenschutz":
      return "/datenschutz";
    case "/nutzungsbestimmungen":
    case "/web/guest/nutzungsbestimmungen":
      return "/nutzungshinweise";
    case "/web/guest/erklaerung-zur-barrierefreiheit":
      return "/erklaerung-zur-barrierefreiheit";
    case "/web/guest/impressum":
      return "/impressum";
    /* information pages */
    case "/web/guest/open-government":
    case "/open-government":
    case "/web/guest/datenbereitsteller":
    case "/datenbereitsteller":
    case "/web/guest/lizenzen":
    case "/lizenzen":
    case "/web/guest/faq":
    case "/faq":
    case "/web/guest/hilfe":
    case "/hilfe":
    case "/web/guest/metadatenschema":
    case "/metadatenschema":
    case "/web/guest/termine":
    case "/termine":
    case "/web/guest/ogd-dachli":
    case "/ogd-dachli":
    case "/web/guest/datenbereitstellungaufgovdata":
    case "/datenbereitstellungaufgovdata":
      return redirectToInformationPage(path);
    default:
      break;
  }

  // dynamic path redirects
  switch (true) {
    case path.startsWith("/web/guest/neues"):
      return "/blog";
    case path.startsWith("/web/guest/erweitertesuche/-/"):
      return redirectExtendedSearch(path);
    case path.includes("/daten/-/details/"):
    case path.startsWith("/web/guest/suchen/-/details/"):
      return redirectDetailsPage(path);
    case path.includes("/suchen/-/searchresult/"):
    case path.includes("/showroom/-/searchresult/"):
    case path.includes("/daten/-/searchresult/"):
    case path.startsWith("/web/guest/suchen"):
      return redirectSearchResult(path);
    default:
      return null;
  }
}

/**
 * Middleware to redirect all legacy Path urls no new urls.
 */
export const withRedirectLegacyPaths: MiddlewareFactory = (request) => {
  const newPath = getRedirectPath(request);

  if (newPath) {
    const newUrl = new URL(newPath, request.url);
    return () => NextResponse.redirect(newUrl, { status: 308 });
  }
};
