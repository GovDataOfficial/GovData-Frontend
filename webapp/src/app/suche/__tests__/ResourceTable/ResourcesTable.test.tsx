import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import { ResourcesTable } from "@/app/suche/_components/ResourceTable/ResourcesTable";
import { Metadata } from "@/types/types";

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
  } as Metadata;
};

describe("ResourceTable", () => {
  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as ReadonlyURLSearchParams,
    );
  });

  it("should render correctly", () => {
    render(<ResourcesTable data={getMockedData()} />);

    screen.getByRole("columnheader", { name: /titel und details/i });
    screen.getByRole("columnheader", { name: /Letzte Änderung/i });
    screen.getByRole("columnheader", { name: /dateiformat/i });
    screen.getByRole("columnheader", { name: /Zur Ressource/i });

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
    const user = userEvent.setup();

    render(<ResourcesTable data={getMockedData()} />);
    const toggleRowButton = screen.getByRole("button", {
      name: /nameonlytext/i,
    });

    expect(toggleRowButton.getAttribute("aria-expanded")).toBe("false");
    expect(toggleRowButton).toHaveAttribute("aria-controls", "id");
    expect(toggleRowButton).toHaveAttribute("href", "?ids=id");

    await user.click(toggleRowButton);

    expect(toggleRowButton.getAttribute("aria-expanded")).toBe("true");
  });

  it.todo("should not render a description if not available");
  it.todo("should not render a license if not available");
  it.todo("should not render a availability if not available");
  it.todo("should render the correct label for open licences");
  it.todo("stable not stable");
  it.todo("should render an info badge if link is not available");
  it.todo("should render a fallback for the title");
  it.todo("should have a fallback href link with the current id");
});
