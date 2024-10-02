import { beforeEach, describe, expect, it, vi } from "vitest";
import { MetaData } from "@/types/types";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { render, screen } from "@testing-library/react";
import { ResourcesTable } from "@/app/suche/_components/ResourceTable/ResourcesTable";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
  usePathname: vi.fn().mockReturnValue({
    getAll: vi.fn(),
  }),
  useRouter: vi.fn(),
}));

const getMockedData = () => {
  return {
    id: "id",
    resources: [
      {
        id: "id",
        nameOnlyText: "nameOnlyText",
        descriptionOnlyText: "descriptionOnlyText",
        modified: "02.02.2023",
        formatShort: "json",
        shortendAvailability: "STABLE",
        url: "/id",
        license: {
          id: "license_1",
          url: "license_url_1",
          open: true,
          title: "license_title_1",
          active: true,
        },
      },
    ],
    open: true,
    url: "/test",
  } as MetaData;
};

describe("ResourceTableMobile", () => {
  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as ReadonlyURLSearchParams,
    );
  });

  it("should render correctly", () => {
    render(<ResourcesTable data={getMockedData()} />);

    screen.getByRole("columnheader", { name: /titel und details/i });
    screen.getByRole("columnheader", { name: /titel und details/i });
    screen.getByRole("columnheader", { name: /dateiformat/i });
    screen.getByRole("columnheader", { name: /dateiformat/i });

    screen.getByRole("cell", { name: /nameonlytext/i });
    screen.getByRole("cell", { name: /02\.02\.2023/i });
    screen.getByRole("cell", { name: /json/i });
    screen.getByRole("cell", { name: /zur ressource/i });

    screen.getByText(/beschreibung/i);
    screen.getByText(/descriptiononlytext/i);

    screen.getByText(/lizenz/i);
    screen.getByText(/freie nutzung/i);

    screen.getByText(/verfügbarkeit/i);
    screen.getByText(/daten werden langfristig erhältlich bleiben \(stable\)/i);
  });

  it("should behave correctly on expand", async () => {
    render(<ResourcesTable data={getMockedData()} />);

    const link = screen.getByRole("button");

    expect(link.getAttribute("aria-controls")).toBe("id");
  });

  it("should not render a description if not available", () => {});

  it("should not render a license if not available", () => {});

  it("should not render a availability if not available", () => {});

  it("should render the correct label for open licences", () => {});

  it("stable not stable", () => {});

  it("should render an info badge if link is not available", () => {});

  it("should render a fallback for the title", () => {});

  it("should have a fallback href link with the current id", () => {});
});
