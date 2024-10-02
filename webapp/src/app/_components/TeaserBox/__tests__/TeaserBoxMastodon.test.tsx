import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { mockMastodonData } from "@/app/_components/TeaserBox/__tests__/testProps";
import { TeaserBoxMastodon } from "@/app/_components/TeaserBox/partials/TeaserBoxMastodon";

describe("TeaserBoxMastodon", () => {
  it("should render a bright teaser box", () => {
    const { container } = render(<TeaserBoxMastodon data={mockMastodonData} />);
    const teaserBoxBright = container.querySelector(".gd-teaser-box-bright");
    expect(teaserBoxBright).toBeInTheDocument();
  });

  it("should render correct mastodon svg", () => {
    render(<TeaserBoxMastodon data={mockMastodonData} />);
    const img = screen.getByRole("presentation");
    expect(img.getAttribute("src")).toContain("mastodon.svg");
  });

  it("should render mastodon text", () => {
    render(<TeaserBoxMastodon data={mockMastodonData} />);
    screen.getByText(mockMastodonData.text);
  });

  it("should render correct time format", () => {
    render(<TeaserBoxMastodon data={mockMastodonData} />);
    screen.getByText("22. Juli 2024");
  });

  it("should link to the mastodon url", () => {
    render(<TeaserBoxMastodon data={mockMastodonData} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", mockMastodonData.url);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("should show the shared text if post is a retweet", () => {
    const retweet = { ...mockMastodonData, isRetweet: true };
    render(<TeaserBoxMastodon data={retweet} />);
    const link = screen.getByRole("link");
    expect(link).toHaveTextContent("hat geteilt");
  });

  it("should show the shared text", () => {
    const noRetweet = { ...mockMastodonData, isRetweet: false };
    render(<TeaserBoxMastodon data={noRetweet} />);
    const link = screen.getByRole("link");
    expect(link).not.toHaveTextContent("hat geteilt");
    expect(link).toHaveTextContent("@opendata");
  });
});
