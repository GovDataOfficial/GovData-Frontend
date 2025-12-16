import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import LocationSearch from "@/app/kartensuche/_components/LocationSearch";
import { NextJSSearchParams } from "@/types/types";

describe("LocationSearch", () => {
  class ResizeObserverMock {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }

  beforeAll(() => {
    // Stub the global ResizeObserver for the map component
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  const sessionId = "session-id";
  const tileUrl = "tile-url";
  const isOSMActive = true;

  it("renders the form with hidden inputs and search button", () => {
    const boundingbox =
      "5.4700927734375,49.89399948318322,12.5299072265625,52.08025065777832";
    const searchParams: NextJSSearchParams = {
      boundingbox,
      q: "test",
    };

    const { container } = render(
      <LocationSearch
        isOSMActive={isOSMActive}
        searchParams={searchParams}
        tileUrl={tileUrl}
        sessionId={sessionId}
      />,
    );

    expect(container.querySelector("form")).toBeDefined();

    // Check for hidden inputs
    const queryInput = screen.getByDisplayValue("test");
    expect(queryInput).toBeInTheDocument();
    expect(queryInput).toHaveAttribute("name", "q");
    expect(queryInput).toHaveAttribute("value", "test");
    expect(queryInput).toHaveAttribute("type", "hidden");

    const boundingboxInput = screen.getByDisplayValue(boundingbox);
    expect(boundingboxInput).toBeInTheDocument();
    expect(boundingboxInput).toHaveAttribute("name", "boundingbox");
    expect(boundingboxInput).toHaveAttribute("value", boundingbox);
    expect(boundingboxInput).toHaveAttribute("type", "hidden");

    expect(
      screen.getByRole("button", { name: /suche senden/i }),
    ).toBeInTheDocument();
  });
});
