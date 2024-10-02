import { describe, expect, it, vi } from "vitest";
import Layout, { metadata } from "../layout";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/app/_lib/getData", () => ({
  fetchTypo3Data: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue(""),
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
}));

vi.mock("@/app/_components/Footer/Footer", () => ({
  Footer: () => <div>footer</div>,
}));
vi.mock("@/app/_components/OffCanvasMenu/OffCanvasMenu", () => ({
  OffCanvasMenu: () => <div>offcanvasmenu</div>,
}));

describe("layout", () => {
  it("should render correct html lang", () => {
    const layout = renderToStaticMarkup(<Layout />);
    expect(layout).toContain('<html lang="de">');
  });

  it("should set id on main landmark", () => {
    const layout = renderToStaticMarkup(<Layout />);
    expect(layout).toContain('<main id="main-content"');
  });

  it("should export correct meta data valid for all pages", () => {
    expect(metadata).toBeDefined();
    expect(metadata.manifest).toBeDefined();
    expect(metadata.applicationName).toBeDefined();
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.icons).toHaveProperty("apple");
    expect(metadata.icons).toHaveProperty("icon");
  });
});
