import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionRelatedLinks } from "@/app/suche/_components/SectionRelatedLinks";
import { showCaseTestData } from "@/app/suche/__tests__/props";
import { ShowCaseData } from "@/types/types";

describe("SectionRelatedLinks", () => {
  const linksToShowcase = [{ id: 9, name: "A1", url: "http://www.test.de" }];
  const usedDatasets = [{ id: 1, name: "U1", url: "http://www.test.de" }];
  const linkToSourcesUrl = "/test/linkToSourcesUrl";
  const linkToSourcesName = "Link Name111";
  const website = "http://testsite.de";

  const showCaseDataWithAllProps = {
    ...showCaseTestData,
    ...{
      linksToShowcase,
      usedDatasets,
      linkToSourcesUrl,
      linkToSourcesName,
      website,
    },
  } satisfies ShowCaseData;

  const showCaseDataWitNoRelatedProps = {
    ...showCaseTestData,
    linksToShowcase: [],
    usedDatasets: [],
    linkToSourcesUrl: undefined,
    linkToSourcesName: undefined,
    website: undefined,
  };

  it("should render all infos", () => {
    render(<SectionRelatedLinks data={showCaseDataWithAllProps} />);
    screen.getByRole("heading", { name: /weiterführende links/i, level: 2 });

    screen.getByRole("heading", { name: "Zur Anwendung", level: 3 });
    screen.getByRole("heading", { name: "Verwendete Datensätze", level: 3 });
    screen.getByRole("heading", { name: "Sourcecode", level: 3 });
    screen.getByRole("heading", { name: "Quelle", level: 3 });
  });

  it("should render nothing if no related infos are provided", () => {
    const { container } = render(
      <SectionRelatedLinks data={showCaseDataWitNoRelatedProps} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
