import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";

import { UmbrellaBrandHeader } from "@/app/_components/UmbrellaBrandHeader/UmbrellaBrandHeader";
import { isFeatureEnabled } from "@/app/_lib/features";

vi.mock("@/app/_lib/features");
vi.mock("@kern-ux/native/dist/js/kern-kopfzeile.js", () => ({}));

const replaceSync = vi.fn();

class FakeCSSStyleSheet {
  replaceSync = replaceSync;
}

class FakeKernKopfzeile extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    Object.defineProperty(shadow, "adoptedStyleSheets", {
      value: [],
      writable: true,
    });
  }
}

describe("UmbrellaBrandHeader", () => {
  beforeAll(() => {
    vi.stubGlobal("CSSStyleSheet", FakeCSSStyleSheet);
    customElements.define("kern-kopfzeile", FakeKernKopfzeile);
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should show header with light theme", () => {
    vi.mocked(isFeatureEnabled).mockReturnValue(true);
    const { container } = render(<UmbrellaBrandHeader />);
    const element = container.querySelector("kern-kopfzeile");
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute("theme", "light");
  });

  it("should not show header", () => {
    vi.mocked(isFeatureEnabled).mockReturnValue(false);
    const { container } = render(<UmbrellaBrandHeader />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should remove left padding inside the shadow DOM", async () => {
    vi.mocked(isFeatureEnabled).mockReturnValue(true);
    const { container } = render(<UmbrellaBrandHeader />);
    const shadow = container.querySelector("kern-kopfzeile")!.shadowRoot!;

    await waitFor(() => expect(shadow.adoptedStyleSheets).toHaveLength(1));
    expect(replaceSync).toHaveBeenCalledWith(
      expect.stringContaining("padding-left: 0"),
    );
  });
});
