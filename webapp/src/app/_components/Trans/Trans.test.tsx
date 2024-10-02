import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Trans } from "./Trans";

describe("Trans", () => {
  it("should render a translated text wrapped with a paragraph", () => {
    const { container } = render(
      <Trans i18nKey="text.paragraph" htmlElement="paragraph" />,
    );

    const paragraph = container.querySelector("p");

    expect(paragraph).toBeDefined();
    expect(paragraph?.textContent).toBe("text.paragraph");
  });

  it("should render a translated text including html wrapped with a paragraph", () => {
    render(
      <Trans
        i18nKey="sparql.schnittstellen.text"
        htmlElement="paragraph"
        params={{
          linkMetadatenkatalog: <a href="/f">metadatenkatalog</a>,
        }}
      />,
    );

    screen.getByRole("link", {
      name: /metadatenkatalog/i,
    });
  });
});
