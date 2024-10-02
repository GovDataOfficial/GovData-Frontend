import { describe, expect, it, test } from "vitest";
import { URLHelper } from "../URLHelper";

describe("URLHelper", () => {
  test("should correctly find all filters", () => {
    const nextParams = { groups: ["1", "2"], format: "ja" };

    const { isFilterActive } = URLHelper(nextParams);

    expect(isFilterActive("groups", "1")).toBeTruthy();
    expect(isFilterActive("groups", "2")).toBeTruthy();
    expect(isFilterActive("format", "ja")).toBeTruthy();
    expect(isFilterActive("filter", "4")).toBeFalsy();
  });

  it("should create correct filter links active Filter", () => {
    const nextParams = { q: "hallo", filter: "notinallowlist", type: "foo" };
    const { createLinkToSearchWithFilter } = URLHelper(nextParams);

    const searchLink = createLinkToSearchWithFilter("type", "nice");
    expect(searchLink).toBe("/suche?q=hallo&type=foo&type=nice");

    const anotherLink = createLinkToSearchWithFilter("type", "foo", true);
    expect(anotherLink).toBe("/suche?q=hallo");
  });

  it("should create correct type link", () => {
    const nextParams = { q: "hallo" };
    const { createLinkToSearchWithType } = URLHelper(nextParams);

    const typeLink = createLinkToSearchWithType("test");
    expect(typeLink).toBe("/suche?q=hallo&type=test");

    const anotherTypeLink = createLinkToSearchWithType("hund");
    expect(anotherTypeLink).toBe("/suche?q=hallo&type=hund");
  });

  it("should create correct sort link", () => {
    const nextParams = { q: "hallo" };
    const { createLinkToSearchWithSort } = URLHelper(nextParams);

    const sortLink = createLinkToSearchWithSort("lastmodification_desc");
    expect(sortLink).toBe("/suche?q=hallo&sort=lastmodification_desc");

    const anotherSortLink = createLinkToSearchWithSort("title_asc");
    expect(anotherSortLink).toBe("/suche?q=hallo&sort=title_asc");
  });

  it("should correctly check for active type", () => {
    const nextParams = { q: "hallo", type: "test" };
    const { getActiveTypeFromCurrentParams } = URLHelper(nextParams);

    expect(getActiveTypeFromCurrentParams()).toBe("test");
  });

  it("should correctly check for active type (all)", () => {
    const nextParams = { q: "hallo" };
    const { getActiveTypeFromCurrentParams } = URLHelper(nextParams);

    expect(getActiveTypeFromCurrentParams()).toBe("all");
  });

  it("should create correct object for input type hidden element", () => {
    const nextParams = {
      q: "hallo",
      test: "a",
      groups: ["fefe", "dada"],
    };
    const { getActiveFiltersForHiddenInput } = URLHelper(nextParams);

    const inputs = getActiveFiltersForHiddenInput();

    expect(inputs).toHaveLength(3);

    expect(inputs[0]).toEqual({
      key: "qhallo",
      type: "hidden",
      name: "q",
      defaultValue: "hallo",
    });
    expect(inputs[1]).toEqual({
      key: "groupsfefe",
      type: "hidden",
      name: "groups",
      defaultValue: "fefe",
    });
    expect(inputs[2]).toEqual({
      key: "groupsdada",
      type: "hidden",
      name: "groups",
      defaultValue: "dada",
    });
  });
});
