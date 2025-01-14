import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import { MetadataFormHelpBox } from "@/app/datenpflege/_components/MetadataForm/partials/MetadataFormHelpBox";

describe("MetadataFormHelpBox", () => {
  const metadataDcatapLink = "http://example.de#metadataDcatapLink";
  const metadataGuideLink = "http://example.de#metadataGuideLink";

  test("should render correct links in help box", () => {
    render(
      <MetadataFormHelpBox
        metadataDcatapLink={metadataDcatapLink}
        metadataGuideLink={metadataGuideLink}
      />,
    );
    const link1 = screen.getByRole("link", { name: /metadaten leitfaden/i });
    expect(link1).toHaveAttribute("href", metadataGuideLink);

    const link2 = screen.getByRole("link", { name: /dcat\-ap\.de/i });
    expect(link2).toHaveAttribute("href", metadataDcatapLink);
  });
});
