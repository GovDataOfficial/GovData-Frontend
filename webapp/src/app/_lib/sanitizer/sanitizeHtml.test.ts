// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  ALLOWLIST_METADATA_NOTES,
  sanitizeHTML,
} from "@/app/_lib/sanitizer/sanitizeHtml";

describe("SanitizeHtml", () => {
  it("should return null", () => {
    expect(sanitizeHTML()).toBeNull();
  });

  it("should keep the text of a relative anchor but drop the tag", () => {
    const dirty = "<a href='/foo'>test</a>";
    const cleaned = sanitizeHTML(dirty, ALLOWLIST_METADATA_NOTES);
    expect(cleaned).toBe("test");
  });

  it("should transform dirty anchor", () => {
    const dirty =
      'test <a href="http://test.de" title="title" alt="alt" style="">link</a>';
    const cleaned = sanitizeHTML(dirty, ALLOWLIST_METADATA_NOTES);
    expect(cleaned).toBe(
      'test <a href="http://test.de" rel="nofollow noopener noreferrer" target="_blank">link</a>',
    );
  });

  it("should keep mailto on anchors", () => {
    const keep = '<a href="mailto://test.de">link</a>';
    const cleaned = sanitizeHTML(keep, ALLOWLIST_METADATA_NOTES);
    expect(cleaned).toBe(
      '<a href="mailto://test.de" rel="nofollow noopener noreferrer" target="_blank">link</a>',
    );
  });

  it("should keep tags produced by the markdown renderer", () => {
    const safe =
      "<p><strong>fett</strong> <em>kursiv</em></p><ol><li>eins</li></ol>" +
      "<blockquote>zitat</blockquote><pre><code>code</code></pre><hr />";
    const cleaned = sanitizeHTML(safe, ALLOWLIST_METADATA_NOTES);
    expect(cleaned).toBe(safe);
  });

  it("should shift headings one level down", () => {
    const dirty = "<h1>eins</h1><h2>zwei</h2><h6>sechs</h6>";
    const cleaned = sanitizeHTML(dirty, ALLOWLIST_METADATA_NOTES);
    expect(cleaned).toBe("<h2>eins</h2><h3>zwei</h3><h6>sechs</h6>");
  });

  it("should keep allowed attributes", () => {
    const safe = "<ul><li>li</li></ul><p>test</p><b>oi</b><i>hi</i><u>uuu</u>";
    const cleaned = sanitizeHTML(safe, ALLOWLIST_METADATA_NOTES);
    expect(cleaned).toBe(safe);
  });

  it("should trim and close", () => {
    const dirty = "test <gdfgfdg fdf      ";
    const cleaned = sanitizeHTML(dirty, ALLOWLIST_METADATA_NOTES);
    expect(cleaned).toBe("test ");
  });

  it("should clean style attributes", () => {
    const dirty =
      '<p style="font-size:xx-small;">font-size:xx-small;</p>\r\n' +
      '<p style="font-size:x-small;">font-size:x-small;</p>\r\n' +
      '<p style="font-size:small;">font-size:small;</p>\r\n' +
      '<p style="font-size:medium;">font-size:medium;</p>\r\n' +
      '<p style="font-size:large;">font-size:large;</p>\r\n' +
      '<p style="font-size:x-large;">font-size:x-large;</p>\r\n' +
      '<p style="font-size:xx-large;">font-size:xx-large;</p>';

    const expected =
      "<p>font-size:xx-small;</p>\r\n" +
      "<p>font-size:x-small;</p>\r\n" +
      "<p>font-size:small;</p>\r\n" +
      "<p>font-size:medium;</p>\r\n" +
      "<p>font-size:large;</p>\r\n" +
      "<p>font-size:x-large;</p>\r\n" +
      "<p>font-size:xx-large;</p>";

    expect(sanitizeHTML(dirty, ALLOWLIST_METADATA_NOTES)).toBe(expected);
  });
});
