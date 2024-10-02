import { describe, expect, it } from "vitest";
import { AutocompleteHighlightedSuggestion } from "@/app/_components/Autocomplete/AutocompleteHighlightedSuggestion";
import { render } from "@testing-library/react";

describe("AutocompleteHighlightedSuggestion", () => {
  it("should correctly highlight inputvalue if given", () => {
    const { container } = render(
      <AutocompleteHighlightedSuggestion
        suggestion={"das ist meine test"}
        inputValue={"meine"}
      />,
    );

    const html = container.innerHTML;
    expect(html).toEqual("das ist <strong>meine</strong> test");
  });

  it("should not highlight if inputvalue is not given", () => {
    const { container } = render(
      <AutocompleteHighlightedSuggestion suggestion={"das ist meine test"} />,
    );

    const html = container.innerHTML;
    expect(html).toEqual("das ist meine test");
  });
});
