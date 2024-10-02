import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeaserBoxes } from "@/app/_components/TeaserBox/TeaserBoxes";
import { fetchPortalNumbers, fetchMastodonData } from "@/app/_lib/getData";
import {
  mockDataNumbers,
  mockMastodonData,
} from "@/app/_components/TeaserBox/__tests__/testProps";

vi.mock("@/app/_lib/getData", () => ({
  fetchPortalNumbers: vi.fn(),
  fetchMastodonData: vi.fn(),
}));

describe("TeaserBox", () => {
  it("should render nothing if no data is provided", async () => {
    const Component = await TeaserBoxes();
    const { container } = render(Component);

    expect(container).toBeEmptyDOMElement();
  });

  it("should render the mastodon teaser box", async () => {
    vi.mocked(fetchMastodonData).mockResolvedValue(mockMastodonData);

    const Component = await TeaserBoxes();
    render(Component);

    screen.getByText(
      "Schon gewusst? Die Tourismus Marketing GmbH ruft dazu auf",
    );
  });

  it("should render the numbers teaser box", async () => {
    vi.mocked(fetchPortalNumbers).mockResolvedValue(mockDataNumbers);

    const Component = await TeaserBoxes();
    render(Component);

    screen.getByText("Datensätze");
  });

  it("should render teaserboxes correctly", async () => {
    vi.mocked(fetchMastodonData).mockResolvedValue(mockMastodonData);
    vi.mocked(fetchPortalNumbers).mockResolvedValue(mockDataNumbers);

    const Component = await TeaserBoxes();
    const { container } = render(Component);

    // invis h2
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Datensätze und Neuigkeiten");
    expect(heading).toHaveClass("sr-only");

    // checking existence of all teaserboxes
    const teaserBoxes = container.querySelectorAll(".gd-teaser-box");
    expect(teaserBoxes).toHaveLength(4);
    // correct translations, not checking mastodon box (has own tests)
    expect(teaserBoxes[0]).toHaveTextContent(/Datensätze/);
    expect(teaserBoxes[1]).toHaveTextContent(/HVD Datensätze/);
    expect(teaserBoxes[2]).toHaveTextContent(/Anwendungen/);
  });
});
