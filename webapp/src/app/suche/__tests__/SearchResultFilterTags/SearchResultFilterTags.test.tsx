import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { SearchResultFilterTags } from "@/app/suche/_components/SearchResultFilterTags/SearchResultFilterTags";

describe("SearchResultFilterTags", () => {
  it("should render screen reader only info", () => {
    render(
      <SearchResultFilterTags
        searchParams={{}}
        filterMap={{}}
        cleanedActiveFilters={{
          groups: ["soci"],
        }}
      />,
    );
    const text = screen.getByText("gefiltert nach:");
    expect(text).toHaveClass("sr-only");
  });

  it("should create two tags for the same category", () => {
    render(
      <SearchResultFilterTags
        searchParams={{}}
        filterMap={{}}
        cleanedActiveFilters={{
          groups: ["soci", "envi"],
        }}
      />,
    );
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);

    within(listItems[0]).getByText("Kategorien:");
    within(listItems[0]).getByText("Bevölkerung und Gesellschaft");
    within(listItems[0]).getByRole("link", { name: "Filter deaktivieren" });

    within(listItems[1]).getByText("Kategorien:");
    within(listItems[1]).getByText("Umwelt");
    within(listItems[1]).getByRole("link", { name: "Filter deaktivieren" });
  });

  it("should set hvd categories translations", () => {
    render(
      <SearchResultFilterTags
        searchParams={{}}
        filterMap={{}}
        cleanedActiveFilters={{
          hvd_categories: ["http%3A%2F%2Fdata.europa.eu%2Fbna%2Fc_164e0bf5"],
        }}
      />,
    );

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(1);

    within(listItems[0]).getByText("Hochwertige Datensatzkategorien:");
    within(listItems[0]).getByText("Meteorologie");
    within(listItems[0]).getByRole("link", { name: "Filter deaktivieren" });
  });

  it("should correct special filter for start and end date", () => {
    render(
      <SearchResultFilterTags
        searchParams={{ start: "2024-06-03", end: "2024-06-26" }}
        filterMap={{ start: { facetList: [] }, end: { facetList: [] } }}
        cleanedActiveFilters={{}}
      />,
    );

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);

    within(listItems[0]).getByText("Zeitbezug von:");
    within(listItems[0]).getByText("03.06.2024");

    within(listItems[1]).getByText("Zeitbezug bis:");
    within(listItems[1]).getByText("26.06.2024");
  });

  it("should correct special filter for boundingbox", () => {
    render(
      <SearchResultFilterTags
        searchParams={{ boundingbox: "1,1,1,1" }}
        filterMap={{ boundingbox: { facetList: [] } }}
        cleanedActiveFilters={{}}
      />,
    );

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(1);

    within(listItems[0]).getByText("Raumbezug");
    within(listItems[0]).getByRole("link", { name: "Filter deaktivieren" });
  });

  it("should render nothing if no cleanedactive param and special filter is given", () => {
    const { container } = render(
      <SearchResultFilterTags
        searchParams={{}}
        filterMap={{}}
        cleanedActiveFilters={{}}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
