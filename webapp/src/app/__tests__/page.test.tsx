import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { isFeatureEnabled } from "@/app/_lib/features";
import { fetchTypo3Data } from "@/app/_lib/getData";
import Home from "@/app/page";

// Mock all the components
vi.mock("@/app/_components/TeaserBox/TeaserBoxes", () => ({
  TeaserBoxes: vi.fn(() => (
    <div data-testid="teaser-boxes">TeaserBoxes Component</div>
  )),
}));

vi.mock("@/app/_components/EditorialContent/EditorialContentMainPage", () => ({
  EditorialContentMainPage: vi.fn(({ pageData }) => (
    <div data-testid="editorial-content">
      EditorialContentMainPage Component
      <span data-testid="page-data">{JSON.stringify(pageData)}</span>
    </div>
  )),
}));

vi.mock("@/app/_components/RegionSearch/RegionSearch", () => ({
  RegionSearch: vi.fn(() => (
    <div data-testid="region-search">RegionSearch Component</div>
  )),
}));

// Mock the features module
vi.mock("@/app/_lib/features", () => ({
  isFeatureEnabled: vi.fn(() => true),
}));

// Mock the data fetching
vi.mock("@/app/_lib/getData", () => ({
  fetchTypo3Data: vi.fn(),
}));

// Mock endpoints
vi.mock("@/configuration/endpoints", () => ({
  endpoints: {
    T3: {
      startseite: "mocked-startseite-endpoint",
    },
  },
}));

describe("Home Page", () => {
  const mockFetchTypo3Data = vi.mocked(fetchTypo3Data);

  const mockPageData = {
    id: 123,
    meta: {
      title: "Test Page Title",
      description: "Test page description",
    },
    content: {
      colPos0: [],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchTypo3Data.mockResolvedValue(mockPageData);
  });

  it("should render all components including RegionSearch", async () => {
    const HomePage = await Home();
    render(HomePage);

    // Verify core components are always rendered
    expect(screen.getByTestId("teaser-boxes")).toBeInTheDocument();
    expect(screen.getByTestId("editorial-content")).toBeInTheDocument();

    // Verify RegionSearch is rendered when feature is enabled
    expect(screen.getByTestId("region-search")).toBeInTheDocument();
  });

  it("should pass correct page data to EditorialContentMainPage", async () => {
    const HomePage = await Home();
    render(HomePage);

    const pageDataElement = screen.getByTestId("page-data");
    expect(pageDataElement.textContent).toBe(JSON.stringify(mockPageData));
  });

  it("should call fetchTypo3Data with correct endpoint", async () => {
    await Home();

    expect(mockFetchTypo3Data).toHaveBeenCalledWith(
      "mocked-startseite-endpoint",
    );
    expect(mockFetchTypo3Data).toHaveBeenCalledTimes(1);
  });

  it("should render core components but not RegionSearch", async () => {
    vi.mocked(isFeatureEnabled).mockReturnValue(false);
    const HomePage = await Home();
    render(HomePage);

    // Verify core components are always rendered
    expect(screen.getByTestId("teaser-boxes")).toBeInTheDocument();
    expect(screen.getByTestId("editorial-content")).toBeInTheDocument();

    // Verify RegionSearch is NOT rendered when feature is disabled
    expect(screen.queryByTestId("region-search")).not.toBeInTheDocument();
  });
});
