import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

describe("SocialMediaLinks", () => {
  let Component: any;

  beforeAll(async () => {
    vi.stubEnv("twitter_url", "http://twitter.test");
    vi.stubEnv("mastodon_url", "http://mastodon.test");
    vi.stubEnv("linkedin_url", "http://linkedin.test");
    vi.stubEnv("gitlab_url", "http://gitlab.test");

    // need to import Component after we stub env here
    const Module = await import("../partials/SocialMediaLinks.jsx");
    const { SocialMediaLinks } = Module;
    Component = SocialMediaLinks();
  });

  it("should render four social media links in second list", async () => {
    render(Component);
    screen.getByText("Besuchen Sie unsere Social-Media-Kanäle");

    const lists = screen.getAllByRole("list");
    const allLinks = within(lists[0]).getAllByRole("link");

    expect(allLinks).toHaveLength(4);

    expect(allLinks[0]).toHaveTextContent("X (ehemals Twitter)");
    expect(allLinks[0]).toHaveAttribute("href", "http://twitter.test");

    expect(allLinks[1]).toHaveTextContent("Mastodon");
    expect(allLinks[1]).toHaveAttribute("href", "http://mastodon.test");

    expect(allLinks[2]).toHaveTextContent("LinkedIn");
    expect(allLinks[2]).toHaveAttribute("href", "http://linkedin.test");

    expect(allLinks[3]).toHaveTextContent("GitLab");
    expect(allLinks[3]).toHaveAttribute("href", "http://gitlab.test");
  });

  it("should set all links to target blank", async () => {
    render(Component);

    const lists = screen.getAllByRole("list");
    const allLinks = within(lists[0]).getAllByRole("link");
    allLinks.forEach((link) =>
      expect(link).toHaveAttribute("target", "_blank"),
    );
  });

  it("should render all icons with an aria-hidden attribute", async () => {
    const { container } = render(Component);

    const allFaIcons = container.querySelectorAll("i");
    expect(allFaIcons).toHaveLength(4);
    allFaIcons.forEach((icon) =>
      expect(icon).toHaveAttribute("aria-hidden", "true"),
    );
  });
});
