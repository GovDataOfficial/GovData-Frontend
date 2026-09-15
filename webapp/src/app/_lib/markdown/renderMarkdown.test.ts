// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  markdownToPlainText,
  markdownToSafeHTML,
  sanitizeSearchResultContent,
} from "@/app/_lib/markdown/renderMarkdown";
import { SearchResults, UnknownSearchResultHit } from "@/types/types";

describe("markdownToSafeHTML", () => {
  it("should return null for empty input", () => {
    expect(markdownToSafeHTML()).toBeNull();
    expect(markdownToSafeHTML("")).toBeNull();
    expect(markdownToSafeHTML("   \n  ")).toBeNull();
  });

  it("should render bold and italic", () => {
    expect(markdownToSafeHTML("**fett** und *kursiv*")).toBe(
      "<p><strong>fett</strong> und <em>kursiv</em></p>\n",
    );
  });

  it("should render paragraphs", () => {
    expect(markdownToSafeHTML("erster\n\nzweiter")).toBe(
      "<p>erster</p>\n<p>zweiter</p>\n",
    );
  });

  it("should keep single line breaks", () => {
    expect(markdownToSafeHTML("erste Zeile\nzweite Zeile")).toBe(
      "<p>erste Zeile<br />zweite Zeile</p>\n",
    );
  });

  it("should render unordered lists", () => {
    expect(markdownToSafeHTML("- eins\n- zwei")).toBe(
      "<ul>\n<li>eins</li>\n<li>zwei</li>\n</ul>\n",
    );
  });

  it("should render ordered lists", () => {
    expect(markdownToSafeHTML("1. eins\n2. zwei")).toBe(
      "<ol>\n<li>eins</li>\n<li>zwei</li>\n</ol>\n",
    );
  });

  it("should shift headings below the page headline", () => {
    const rendered = markdownToSafeHTML("# eins\n\n## zwei\n\n###### sechs");

    expect(rendered).toContain("<h2>eins</h2>");
    expect(rendered).toContain("<h3>zwei</h3>");
    // h6 cannot be shifted any further
    expect(rendered).toContain("<h6>sechs</h6>");
    expect(rendered).not.toContain("<h1>");
  });

  it("should render absolute links as clickable anchors", () => {
    expect(markdownToSafeHTML("[Portal](https://example.org)")).toBe(
      '<p><a href="https://example.org" rel="nofollow noopener noreferrer" target="_blank">Portal</a></p>\n',
    );
  });

  it("should render bare urls as clickable anchors", () => {
    expect(markdownToSafeHTML("Siehe https://example.org")).toBe(
      '<p>Siehe <a href="https://example.org" rel="nofollow noopener noreferrer" target="_blank">https://example.org</a></p>\n',
    );
  });

  it("should keep mailto links", () => {
    expect(markdownToSafeHTML("[Mail](mailto:test@example.org)")).toBe(
      '<p><a href="mailto:test@example.org" rel="nofollow noopener noreferrer" target="_blank">Mail</a></p>\n',
    );
  });

  it("should keep the text of relative links but drop the anchor", () => {
    // Relative targets point at the source portal and would be dead links here
    expect(
      markdownToSafeHTML("[Datensatz](/dataset/raddauerzaehlstellen)"),
    ).toBe("<p>Datensatz</p>\n");
  });

  it("should keep existing html from the source", () => {
    expect(markdownToSafeHTML("<p>bestehendes <b>HTML</b></p>")).toBe(
      "<p>bestehendes <b>HTML</b></p>",
    );
  });

  it("should render markdown mixed into html", () => {
    const rendered = markdownToSafeHTML(
      "<p>HTML Absatz</p>\n\n**Markdown Absatz**",
    );

    expect(rendered).toBe(
      "<p>HTML Absatz</p><p><strong>Markdown Absatz</strong></p>\n",
    );
  });

  it("should remove scripts including their content", () => {
    const rendered = markdownToSafeHTML("Text\n\n<script>alert(1)</script>");

    expect(rendered).not.toContain("script");
    expect(rendered).not.toContain("alert");
  });

  it("should remove event handlers and disallowed tags", () => {
    const rendered = markdownToSafeHTML(
      '<img src="https://evil.example/x.png" alt="" onerror="alert(1)">' +
        '<iframe src="https://evil.example"></iframe>',
    );

    expect(rendered).not.toContain("onerror");
    expect(rendered).not.toContain("<img");
    expect(rendered).not.toContain("<iframe");
  });

  it("should drop javascript urls", () => {
    const rendered = markdownToSafeHTML(
      "[klick](javascript:alert(document.cookie))",
    );

    expect(rendered).not.toContain("javascript:");
    expect(rendered).not.toContain("<a");
  });

  it("should wrap tables into a scrollable container", () => {
    const rendered = markdownToSafeHTML(
      "| Spalte | Wert |\n| --- | --- |\n| eins | 1 |",
    );

    expect(rendered).toContain('<div class="gd-table-scroll" tabindex="0">');
    expect(rendered).toContain("</table></div>");
    // the wrapper must not break the table markup itself
    expect(rendered).toContain("<th>Spalte</th>");
    expect(rendered).toContain("<td>eins</td>");
  });

  describe("descriptions that are not markdown", () => {
    it("should leave plain prose untouched", () => {
      expect(
        markdownToSafeHTML(
          "Die Daten wurden 2020 - 2024 erhoben (Stand: 01.03.2024).",
        ),
      ).toBe(
        "<p>Die Daten wurden 2020 - 2024 erhoben (Stand: 01.03.2024).</p>\n",
      );
    });

    it("should not read syntax characters inside words as markup", () => {
      // `#` without a following space is no heading, `_` inside a word is no
      // emphasis and a lone `*` needs a closing counterpart
      expect(
        markdownToSafeHTML("Spalte snake_case, Tag #opendata, 5 * 5"),
      ).toBe("<p>Spalte snake_case, Tag #opendata, 5 * 5</p>\n");
    });

    it("should escape characters that are unsafe in html", () => {
      expect(markdownToSafeHTML("Wald & Wiese, 5 < 6")).toBe(
        "<p>Wald &amp; Wiese, 5 &lt; 6</p>\n",
      );
    });

    it("should not turn a line starting with a date into a list", () => {
      expect(
        markdownToSafeHTML("1. Januar 2024 wurden die Daten erhoben."),
      ).toBe("<p>1. Januar 2024 wurden die Daten erhoben.</p>\n");
      expect(markdownToSafeHTML("2024. Ein Rückblick auf die Erhebung.")).toBe(
        "<p>2024. Ein Rückblick auf die Erhebung.</p>\n",
      );
    });

    it("should still render an intentional multi-item ordered list", () => {
      expect(markdownToSafeHTML("5. fünf\n6. sechs")).toBe(
        '<ol start="5">\n<li>fünf</li>\n<li>sechs</li>\n</ol>\n',
      );
    });

    it("should fall back to a list when the single item has multiple blocks", () => {
      // A loose single-item list (item with two paragraphs) is clearly
      // intentional — render as `<ol>` rather than crashing on the
      // paragraph token or collapsing both blocks into one line.
      const rendered = markdownToSafeHTML("1. Erste Zeile\n\n   Zweite Zeile");

      expect(rendered).toContain("<ol>");
      expect(rendered).toContain("Erste Zeile");
      expect(rendered).toContain("Zweite Zeile");
    });

    it("should keep placeholder notation instead of reading it as html", () => {
      expect(markdownToSafeHTML("Format: <Name>, <Ort>, <PLZ>")).toBe(
        "<p>Format: &lt;Name&gt;, &lt;Ort&gt;, &lt;PLZ&gt;</p>\n",
      );
    });
  });

  it("should render the description of the greifswald dataset", () => {
    const source =
      "\nDie Datensammlung enthält die amtliche Straßenliste.\n\n" +
      "**Aktualisierungszyklus:**\n\n" +
      "- Eine regelmäßige Aktualisierung erfolgt nicht.\n" +
      "- Fortschreibung nach Bedarf.\n";

    expect(markdownToSafeHTML(source)).toBe(
      "<p>Die Datensammlung enthält die amtliche Straßenliste.</p>\n" +
        "<p><strong>Aktualisierungszyklus:</strong></p>\n" +
        "<ul>\n" +
        "<li>Eine regelmäßige Aktualisierung erfolgt nicht.</li>\n" +
        "<li>Fortschreibung nach Bedarf.</li>\n" +
        "</ul>\n",
    );
  });
});

describe("markdownToPlainText", () => {
  it("should return undefined for empty input", () => {
    expect(markdownToPlainText()).toBeUndefined();
    expect(markdownToPlainText("")).toBeUndefined();
    expect(markdownToPlainText("  \n ")).toBeUndefined();
  });

  it("should strip markdown syntax", () => {
    expect(markdownToPlainText("**fett** und *kursiv*")).toBe(
      "fett und kursiv",
    );
  });

  it("should collapse blocks into a single line", () => {
    const source =
      "\nDie Datensammlung enthält die amtliche Straßenliste.\n\n" +
      "**Aktualisierungszyklus:**\n\n" +
      "- Eine regelmäßige Aktualisierung erfolgt nicht.\n" +
      "- Fortschreibung nach Bedarf.\n";

    expect(markdownToPlainText(source)).toBe(
      "Die Datensammlung enthält die amtliche Straßenliste. " +
        "Aktualisierungszyklus: " +
        "Eine regelmäßige Aktualisierung erfolgt nicht. " +
        "Fortschreibung nach Bedarf.",
    );
  });

  it("should keep the link text and drop the target", () => {
    expect(markdownToPlainText("Siehe [Portal](https://example.org)")).toBe(
      "Siehe Portal",
    );
  });

  it("should strip html from the source", () => {
    expect(markdownToPlainText("<p>Text mit <b>HTML</b></p>")).toBe(
      "Text mit HTML",
    );
  });

  it("should decode html entities", () => {
    expect(markdownToPlainText("Wald &amp; Wiese, 5 &lt; 6")).toBe(
      "Wald & Wiese, 5 < 6",
    );
  });

  it("should not leak script content", () => {
    expect(markdownToPlainText("Text\n\n<script>alert(1)</script>")).toBe(
      "Text",
    );
  });
});

describe("sanitizeSearchResultContent", () => {
  it("should render markdown syntax in a hit's content as plain text", () => {
    const data = {
      hits: [{ content: "**fett** und eine Liste:\n\n- eins\n- zwei" }],
    } as unknown as SearchResults<UnknownSearchResultHit>;

    expect(sanitizeSearchResultContent(data).hits[0].content).toBe(
      "fett und eine Liste: eins zwei",
    );
  });

  it("should fall back to an empty string for empty content", () => {
    const data = {
      hits: [{ content: "" }],
    } as unknown as SearchResults<UnknownSearchResultHit>;

    expect(sanitizeSearchResultContent(data).hits[0].content).toBe("");
  });
});
