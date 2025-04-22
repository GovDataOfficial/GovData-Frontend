import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FILTERS } from "@/app/_lib/URLHelper";
import { SearchDetailsInfoboxFilterTagAnchor } from "@/app/suche/_components/SearchDetailsInfobox/SearchDetailsInfoboxFilterTagAnchor";
import { i18n } from "@/i18n";

describe("SearchDetailsInfoboxFilterTagAnchor", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders correctly with given props", () => {
    const searchCriteria = FILTERS.PUBLISHER;
    const searchCriteriaValue = "a publisher";
    const children = <span>{searchCriteriaValue}</span>;

    render(
      <SearchDetailsInfoboxFilterTagAnchor
        searchCriteria={searchCriteria}
        searchCriteriaValue={searchCriteriaValue}
      >
        {children}
      </SearchDetailsInfoboxFilterTagAnchor>,
    );

    const linkElement = screen.getByRole("link", { name: /a publisher/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute(
      "href",
      `/suche?publisher=a%20publisher`,
    );
  });

  it("displays the correct tooltip", async () => {
    const searchCriteria = FILTERS.PUBLISHER;
    const searchCriteriaValue = "a publisher";
    const children = <span>{searchCriteriaValue}</span>;
    const user = userEvent.setup();

    render(
      <SearchDetailsInfoboxFilterTagAnchor
        searchCriteria={searchCriteria}
        searchCriteriaValue={searchCriteriaValue}
      >
        {children}
      </SearchDetailsInfoboxFilterTagAnchor>,
    );

    const linkElement = screen.getByRole("link", { name: /a publisher/i });
    const tooltipText = i18n.t("search.details.infobox.tooltip", {
      target: i18n.t(`search.details.infobox.tooltip.target.${searchCriteria}`),
    });

    // hover over element to trigger tooltip
    await user.hover(linkElement);
    await vi.advanceTimersByTimeAsync(500);

    // tooltip is now visible with contents of title attribute
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeVisible();
    expect(tooltip).toHaveTextContent(tooltipText);
  });
});
