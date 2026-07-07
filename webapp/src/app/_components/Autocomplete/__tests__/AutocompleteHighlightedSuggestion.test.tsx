import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { AutocompleteHighlightedSuggestion } from "@/app/_components/Autocomplete/AutocompleteHighlightedSuggestion";

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

  it("should highlight each word in inputValue separately", () => {
    const { container } = render(
      <AutocompleteHighlightedSuggestion
        suggestion={"das ist meine test"}
        inputValue={"das te"}
      />,
    );
    const html = container.innerHTML;
    expect(html).toEqual(
      "<strong>das</strong> ist meine <strong>te</strong>st",
    );
  });
});
