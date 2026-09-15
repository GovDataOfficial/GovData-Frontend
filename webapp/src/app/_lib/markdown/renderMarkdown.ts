import htmlTags from "html-tags";
import { Marked } from "marked";

import {
  ALLOWLIST_METADATA_NOTES,
  sanitizeHTML,
} from "@/app/_lib/sanitizer/sanitizeHtml";
import { SearchResults, UnknownSearchResultHit } from "@/types/types";

/**
 * `breaks` keeps single line breaks visible, which many harvested
 * descriptions rely on. `gfm` adds autolinks and task/table syntax.
 */
const marked = new Marked({ gfm: true, breaks: true });

/**
 * Harvested descriptions sometimes use angle brackets as placeholder
 * notation ("Format: <Name>, <Ort>"). Markdown can't tell that apart from
 * real HTML syntactically, so without this, `<Name>` would be read as an
 * (unknown, unclosed) tag and vanish entirely. Escaping it here, before
 * marked ever sees it, keeps the placeholder visible as plain text while
 * leaving actual HTML tags untouched for the sanitizer to handle.
 */
function escapeUnknownTags(markdown: string): string {
  return markdown.replace(
    /<(\/?)([A-Za-z][A-Za-z0-9-]*)((?:\s+[^<>]*)?\s*\/?)>/g,
    (match, closingSlash, tagName, rest) =>
      htmlTags.includes(tagName.toLowerCase() as (typeof htmlTags)[number])
        ? match
        : `&lt;${closingSlash}${tagName}${rest}&gt;`,
  );
}

/**
 * A single-item ordered list is far more likely a date or enumeration at the
 * start of a sentence ("1. Januar 2024", "2024. Ein Rückblick") than an
 * intentional list, so it is rendered as a plain paragraph instead of `<ol>`.
 *
 * A list item's `tokens` are block-level: a tight item holds a single `text`
 * token, a loose one wraps its content in `paragraph`. Either way we need the
 * inner inline tokens for `parseInline`; anything more complex (multiple
 * blocks, nested list, code) is clearly an intentional list and falls back to
 * the default `<ol>` renderer.
 */
marked.use({
  renderer: {
    list(token) {
      if (token.ordered && token.items.length === 1) {
        const [child, ...rest] = token.items[0].tokens;
        if (
          rest.length === 0 &&
          (child?.type === "text" || child?.type === "paragraph")
        ) {
          return `<p>${token.start}. ${this.parser.parseInline(child.tokens ?? [])}</p>\n`;
        }
      }
      return false;
    },
  },
});

const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&#39;": "'",
  "&#x27;": "'",
  "&nbsp;": " ",
};

function decodeHTMLEntities(text: string): string {
  return text.replace(
    /&(?:amp|lt|gt|quot|apos|nbsp|#39|#x27);/gi,
    (entity) => HTML_ENTITIES[entity.toLowerCase()] ?? entity,
  );
}

/**
 * Put a horizontally scrollable wrapper around tables, which would otherwise
 * push the layout apart on narrow viewports. `tabindex` keeps the scroll
 * container reachable by keyboard (WCAG 2.1.1).
 *
 * This runs after sanitizing on purpose: the inserted markup is a constant and
 * sanitize-html has already balanced its own output, so the remaining table
 * tags are attribute-free and match verbatim.
 */
function wrapTables(html: string): string {
  return html
    .replace(/<table>/g, '<div class="gd-table-scroll" tabindex="0"><table>')
    .replace(/<\/table>/g, "</table></div>");
}

/**
 * Convert Markdown to HTML that is safe to pass into dangerouslySetInnerHTML.
 *
 * Markdown parsers pass raw HTML from the source through untouched, so
 * sanitizing has to stay the last step of the pipeline:
 * markdown -> HTML -> sanitize.
 */
export function markdownToSafeHTML(markdown?: string): string | null {
  if (!markdown?.trim()) {
    return null;
  }

  const html = marked.parse(escapeUnknownTags(markdown), { async: false });
  const safeHTML = sanitizeHTML(html, ALLOWLIST_METADATA_NOTES);

  return safeHTML ? wrapTables(safeHTML) : null;
}

/**
 * Reduce Markdown to a single line of plain text, e.g., for meta-descriptions
 * and social media previews where syntax characters would be visible.
 */
export function markdownToPlainText(markdown?: string): string | undefined {
  if (!markdown?.trim()) {
    return undefined;
  }

  const html = marked.parse(escapeUnknownTags(markdown), { async: false });
  const text = sanitizeHTML(html);

  if (!text) {
    return undefined;
  }

  return decodeHTMLEntities(text).replace(/\s+/g, " ").trim() || undefined;
}

/**
 * Reduce the Markdown in each search hit's content snippet to plain text, so
 * the search result list (which only renders text, not HTML) doesn't show
 * raw syntax characters.
 */
export function sanitizeSearchResultContent(
  data: SearchResults<UnknownSearchResultHit>,
): SearchResults<UnknownSearchResultHit> {
  const strippedHits = data.hits.map((hit) => ({
    ...hit,
    content: markdownToPlainText(hit.content) || "",
  }));

  return { ...data, hits: strippedHits };
}
