import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  mockDataNumbers,
  mockMastodonData,
} from "@/app/_components/TeaserBox/__tests__/testProps";
import { TeaserBoxes } from "@/app/_components/TeaserBox/TeaserBoxes";
import { isFeatureEnabled } from "@/app/_lib/features";
import { fetchMastodonData, fetchPortalNumbers } from "@/app/_lib/getData";
import { Feature } from "@/configuration/featureFlags/types";

vi.mock("@/app/_lib/getData", () => ({
  fetchPortalNumbers: vi.fn(),
  fetchMastodonData: vi.fn(),
}));

vi.mock("@/app/_lib/features", () => ({
  isFeatureEnabled: vi.fn(() => true),
}));

describe("TeaserBox", () => {
  const mockFetchPortalNumbers = vi.mocked(fetchPortalNumbers);
  const mockFetchMastodonData = vi.mocked(fetchMastodonData);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render nothing if no data is provided", async () => {
    mockFetchPortalNumbers.mockResolvedValue(undefined);
    mockFetchMastodonData.mockResolvedValue(undefined);

    const Component = await TeaserBoxes();
    const { container } = render(Component);

    expect(container).toBeEmptyDOMElement();
  });

  it("should render the mastodon teaser box when feature is enabled", async () => {
    mockFetchPortalNumbers.mockResolvedValue(undefined);
    mockFetchMastodonData.mockResolvedValue(mockMastodonData);

    const Component = await TeaserBoxes();
    render(Component);

    screen.getByText(
      "Schon gewusst? Die Tourismus Marketing GmbH ruft dazu auf",
    );
    expect(mockFetchMastodonData).toHaveBeenCalledTimes(1);
  });

  it("should render the numbers teaser box", async () => {
    mockFetchPortalNumbers.mockResolvedValue(mockDataNumbers);
    mockFetchMastodonData.mockResolvedValue(undefined);

    const Component = await TeaserBoxes();
    render(Component);

    screen.getByText("Datensätze");
  });

  it("should render teaserboxes correctly when Mastodon integration is enabled", async () => {
    mockFetchMastodonData.mockResolvedValue(mockMastodonData);
    mockFetchPortalNumbers.mockResolvedValue(mockDataNumbers);

    const Component = await TeaserBoxes();
    const { container } = render(Component);

    // invis h2
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Datensätze und Neuigkeiten");
    expect(heading).toHaveClass("sr-only");

    // checking existence of all teaserboxes (including mastodon when feature is enabled)
    const teaserBoxes = container.querySelectorAll(".gd-teaser-box");
    expect(teaserBoxes).toHaveLength(4);
    // correct translations, not checking mastodon box (has own tests)
    expect(teaserBoxes[0]).toHaveTextContent(/Datensätze/);
    expect(teaserBoxes[1]).toHaveTextContent(/HVD Datensätze/);
    expect(teaserBoxes[2]).toHaveTextContent(/Anwendungen/);

    // Verify mastodon data was fetched
    expect(mockFetchMastodonData).toHaveBeenCalledTimes(1);
  });

  it("teaserbox HVD should have correct href", async () => {
    mockFetchPortalNumbers.mockResolvedValue(mockDataNumbers);
    mockFetchMastodonData.mockResolvedValue(undefined);

    const Component = await TeaserBoxes();
    render(Component);

    const teaserBoxHVD = screen.getByRole("link", { name: /hvd datensätze/i });
    expect(teaserBoxHVD).toHaveAttribute(
      "href",
      "/suche?hvd=has_hvd&type=dataset",
    );
  });

  it("should fetch mastodon data and render mastodon teaser box", async () => {
    mockFetchPortalNumbers.mockResolvedValue(mockDataNumbers);
    mockFetchMastodonData.mockResolvedValue(mockMastodonData);

    const Component = await TeaserBoxes();
    const { container } = render(Component);

    // Verify mastodon data was fetched
    expect(mockFetchMastodonData).toHaveBeenCalledTimes(1);
    expect(vi.mocked(isFeatureEnabled)).toHaveBeenCalledWith(
      Feature.showMastodonTeaserBox,
    );
    expect(
      screen.getByText(
        "Schon gewusst? Die Tourismus Marketing GmbH ruft dazu auf",
      ),
    ).toBeInTheDocument();
  });

  it("should render only numbers when mastodon data is unavailable", async () => {
    mockFetchPortalNumbers.mockResolvedValue(mockDataNumbers);
    mockFetchMastodonData.mockResolvedValue(undefined);

    const Component = await TeaserBoxes();
    const { container } = render(Component);

    // Verify mastodon data was attempted to be fetched
    expect(mockFetchMastodonData).toHaveBeenCalledTimes(1);

    // Should render 3 number boxes but no mastodon box
    const teaserBoxes = container.querySelectorAll(".gd-teaser-box");
    expect(teaserBoxes).toHaveLength(3);
    expect(
      container.querySelector(".gd-teaser-box-social"),
    ).not.toBeInTheDocument();
  });

  it("should render only mastodon when numbers data is unavailable", async () => {
    mockFetchPortalNumbers.mockResolvedValue(undefined);
    mockFetchMastodonData.mockResolvedValue(mockMastodonData);

    const Component = await TeaserBoxes();
    const { container } = render(Component);

    // Verify mastodon data was fetched
    expect(mockFetchMastodonData).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText(
        "Schon gewusst? Die Tourismus Marketing GmbH ruft dazu auf",
      ),
    ).toBeInTheDocument();
  });

  it("should NOT fetch mastodon data and NOT render mastodon teaser box", async () => {
    vi.mocked(isFeatureEnabled).mockReturnValue(false);
    mockFetchPortalNumbers.mockResolvedValue(mockDataNumbers);

    const Component = await TeaserBoxes();
    const { container } = render(Component);

    // Verify mastodon data was NOT fetched
    expect(mockFetchMastodonData).toHaveBeenCalledTimes(0);
    expect(
      screen.queryByText(
        "Schon gewusst? Die Tourismus Marketing GmbH ruft dazu auf",
      ),
    ).not.toBeInTheDocument();

    // Should still render 3 number boxes
    const teaserBoxes = container.querySelectorAll(".gd-teaser-box");
    expect(teaserBoxes).toHaveLength(3);
  });

  it("should render nothing when both mastodon is disabled and numbers data is unavailable", async () => {
    vi.mocked(isFeatureEnabled).mockReturnValue(false);
    mockFetchPortalNumbers.mockResolvedValue(undefined);

    const Component = await TeaserBoxes();
    const { container } = render(Component);

    // Verify mastodon data was NOT fetched
    expect(mockFetchMastodonData).toHaveBeenCalledTimes(0);

    // Should render nothing
    expect(container).toBeEmptyDOMElement();
  });

  it("should still render numbers when mastodon is disabled but numbers data is available", async () => {
    vi.mocked(isFeatureEnabled).mockReturnValue(false);
    mockFetchPortalNumbers.mockResolvedValue(mockDataNumbers);

    const Component = await TeaserBoxes();
    render(Component);

    // Verify mastodon data was NOT fetched
    expect(mockFetchMastodonData).toHaveBeenCalledTimes(0);

    // Verify number boxes are still rendered
    expect(screen.getByText("Datensätze")).toBeInTheDocument();
    expect(screen.getByText("HVD Datensätze")).toBeInTheDocument();
    expect(screen.getByText("Anwendungen")).toBeInTheDocument();
  });
});
