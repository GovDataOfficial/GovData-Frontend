import CSPBuilder from "content-security-policy-builder";

import { fetchMetadata } from "@/app/_lib/getData";
import { MiddlewareFactory } from "@/middlewares/types";

// Default CSP directives based on helmet js.
const defaultCSP = {
  "default-src": ["'self'"],
  "base-uri": ["'self'"],
  "font-src": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'self'"],
  "img-src": ["'self'", "data:"],
  "object-src": ["'none'"],
  "script-src": ["'self'", "'unsafe-inline'"],
  "script-src-attr": ["'none'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "connect-src": ["'self'"],
};

function addExtraCSP(env: string | undefined, directive: string[]) {
  try {
    const parsedEnv = env && JSON.parse(env);
    if (Array.isArray(parsedEnv)) {
      // Don't include empty entries
      const cleanedEnv = parsedEnv.filter((entry) => entry.trim() !== "");
      directive.push(...cleanedEnv);
    }
  } catch (e) {
    throw Error(`could not JSON parse ${env}`);
  }
}

addExtraCSP(process.env.csp_extra_img_src, defaultCSP["img-src"]);
addExtraCSP(process.env.csp_extra_script_src, defaultCSP["script-src"]);
addExtraCSP(process.env.csp_extra_connect_src, defaultCSP["connect-src"]);
addExtraCSP(process.env.csp_extra_style_src, defaultCSP["style-src"]);
addExtraCSP(process.env.csp_extra_font_src, defaultCSP["font-src"]);

const cspDirectives = CSPBuilder({ directives: defaultCSP });

async function getResourceUrlsForMetadata(metadataName?: string) {
  if (!metadataName) {
    return [];
  }

  try {
    const data = await fetchMetadata(metadataName);
    return data?.resources.map((resource) => resource.url) || [];
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return [];
  }
}

/**
 * Extracts unique origins (protocol + host + optional port) from a list of URLs.
 * This reduces the number of CSP entries by grouping all resources from the same host.
 * Invalid URLs are ignored.
 *
 * @param urls Array of resource URLs
 * @returns Array of unique origins suitable for CSP
 */
function getUniqueOrigins(urls: string[]): string[] {
  const origins = new Set<string>();
  urls.forEach((url) => {
    try {
      const { protocol, hostname, port } = new URL(url);
      // For now, just use the origin (protocol + host + port)
      const origin = `${protocol}//${hostname}${port ? `:${port}` : ""}`;
      origins.add(origin);
    } catch {
      // Ignore invalid URLs
    }
  });
  return Array.from(origins);
}

/**
 * Middleware for setting CSP and other relevant Headers.
 */
export const withHeadersMiddleware: MiddlewareFactory = async (
  _request,
  response,
) => {
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");

  // Set CSP for detail pages to allow map preview to load data
  // Only allow resource URLs
  if (_request.nextUrl.pathname.startsWith("/suche/daten/")) {
    const detailPageCsp = { ...defaultCSP };
    detailPageCsp["connect-src"] = [...defaultCSP["connect-src"]];
    const { pathname } = new URL(_request.nextUrl);
    const metadataName = pathname.split("/").pop();
    const resourceUrls = await getResourceUrlsForMetadata(metadataName);

    // Optimize: Use only unique origins
    const uniqueOrigins = getUniqueOrigins(resourceUrls);
    detailPageCsp["connect-src"].push(...uniqueOrigins);

    const detailPageDirectives = CSPBuilder({ directives: detailPageCsp });
    response.headers.set("Content-Security-Policy", detailPageDirectives);
  } else {
    response.headers.set("Content-Security-Policy", cspDirectives);
  }
};
