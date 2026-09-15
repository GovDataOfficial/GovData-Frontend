import sanitize from "sanitize-html";

/**
 * Link targets that may become an anchor.
 *
 * Relative targets are dropped on purpose: they are written for the source
 * portal (e.g. `/dataset/foo` in a harvested description) and would resolve
 * against govdata.de, producing a dead link.
 */
const LINKABLE_TARGET = /^(https?:|ftp:|mailto:)/i;

export const ALLOWLIST_METADATA_NOTES = {
  allowedTags: [
    "a",
    "b",
    "blockquote",
    "br",
    "code",
    "em",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "i",
    "li",
    "ol",
    "p",
    "pre",
    "strong",
    "table",
    "tbody",
    "td",
    "th",
    "thead",
    "tr",
    "u",
    "ul",
  ],
  allowedAttributes: {
    a: ["href", "rel", "target"],
    // A line starting with a number ("2024. Ein Rückblick") is read as an
    // ordered list by every Markdown parser. Keeping `start` at least preserves
    // the number in the text instead of renumbering it to 1.
    ol: ["start"],
  },
  allowedSchemes: ["ftp", "http", "https", "mailto"],
  transformTags: {
    // The page headline is the dataset title, so headings coming from the
    // description start one level below it. Transforms are not applied
    // recursively, so this shifts every level by exactly one.
    h1: "h2",
    h2: "h3",
    h3: "h4",
    h4: "h5",
    h5: "h6",
    a: (tagName: string, attribs: any) => {
      if (!LINKABLE_TARGET.test(attribs?.href || "")) {
        // span is not allowed, so the tag is dropped and the text kept.
        return { tagName: "span", attribs: {} };
      }

      return {
        tagName,
        attribs: {
          ...attribs,
          rel: "nofollow noopener noreferrer",
          target: "_blank",
        },
      };
    },
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
