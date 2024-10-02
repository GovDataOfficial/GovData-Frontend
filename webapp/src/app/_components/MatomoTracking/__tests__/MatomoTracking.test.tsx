import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { MatomoTracking } from "@/app/_components/MatomoTracking/MatomoTracking";
import { renderToStaticMarkup } from "react-dom/server";

describe("Matomo Tracking", () => {
  const matomo_tracker_url = "matomo_tracker_url";
  const matomo_site_id = "matomo_site_id";

  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("should render nothing if tracking url is null", () => {
    vi.stubEnv(matomo_site_id, "55");

    const { container } = render(<MatomoTracking />);
    expect(container).toBeEmptyDOMElement();
    expect(window._paq).toBeUndefined();
  });

  it("should render nothing if siteId is null", () => {
    vi.stubEnv(matomo_tracker_url, "https://test.de");

    const { container } = render(<MatomoTracking />);
    expect(container).toBeEmptyDOMElement();
    expect(window._paq).toBeUndefined();
  });

  it("should insert a script tag for loading matomo js", () => {
    vi.stubEnv(matomo_tracker_url, "https://test.de");
    vi.stubEnv(matomo_site_id, "55");

    render(<MatomoTracking />);
    const scriptTag = document.querySelector("script");
    expect(scriptTag).toHaveAttribute("src", "https://test.de/matomo.js");
  });

  it("should set correct matomo config in window object", () => {
    vi.stubEnv(matomo_tracker_url, "https://test.de");
    vi.stubEnv(matomo_site_id, "55");

    render(<MatomoTracking />);
    expect(window._paq).toHaveLength(4);
    expect(window._paq).toEqual(
      expect.arrayContaining([["setTrackerUrl", "https://test.de/matomo.php"]]),
    );
    expect(window._paq).toEqual(expect.arrayContaining([["setSiteId", "55"]]));
  });

  it("should add noscript for tracking nojs user", () => {
    vi.stubEnv(matomo_tracker_url, "https://test.de");
    vi.stubEnv(matomo_site_id, "55");
    // testing with static markup as render() function with jsdom will render
    // empty noscript tag
    const staticMarkup = renderToStaticMarkup(<MatomoTracking />);
    expect(staticMarkup).toContain(
      '<noscript><img src="https://test.de/matomo.php?idsite=55" alt="" class="d-none" loading="lazy"/></noscript>',
    );
  });
});
