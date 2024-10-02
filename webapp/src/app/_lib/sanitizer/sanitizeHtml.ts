import sanitize from "sanitize-html";
import { SearchResults } from "@/types/types";

export const ALLOWLIST_METADATA_NOTES = {
  allowedTags: ["a", "li", "ol", "p", "ul", "br", "b", "i", "u"],
  allowedAttributes: {
    a: ["href", "rel", "target"],
  },
  allowedSchemes: ["ftp", "http", "https", "mailto"],
  transformTags: {
    a: (tagName: string, attribs: any) => ({
      tagName,
      attribs: { ...attribs, rel: "nofollow", target: "_blank" },
    }),
  },
} satisfies sanitize.IOptions;

const DEFAULT_REMOVE_ALL = {
  allowedTags: [],
  allowedAttributes: {},
} satisfies sanitize.IOptions;

/**
 * Sanitize a given HTML string.
 * if not opts are given all HTML will be stripped.
 *
 * ! Make sure that this Method is only used on the server !
 *
 * @see https://github.com/apostrophecms/sanitize-html
 */
export function sanitizeHTML(
  html?: string,
  opts?: sanitize.IOptions,
): string | null {
  return html ? sanitize(html, opts || DEFAULT_REMOVE_ALL) : null;
}

export function stripSearchResultHTMLContent(
  data: SearchResults,
): SearchResults {
  const sanitizedHits = data.hits.map((hit) => {
    const sanitizedContent = sanitizeHTML(hit.content);
    return { ...hit, content: sanitizedContent || "" };
  });

  return { ...data, hits: sanitizedHits };
}
