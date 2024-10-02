import { beforeEach, describe, expect, it, vi } from "vitest";
import { ResourceTableMobile } from "../../_components/ResourceTable/ResourceTableMobile";
import { act, render, screen } from "@testing-library/react";
import { MetaData } from "@/types/types";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import userEvent from "@testing-library/user-event";

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

  // todo
  it.skip("should render correctly", () => {
    const mockedData = getMockedData();

    render(<ResourceTableMobile data={mockedData} />);

    screen.getByRole("heading", { name: /nameOnlyText/i });
    screen.getByRole("link", { name: /mehr informationen anzeigen/i });

    screen.getByText(/letzte änderung/i);
    screen.getByText(mockedData.resources[0].modified);

    screen.getByText(/dateiformat/i);
    screen.getByText(mockedData.resources[0].formatShort);

    screen.getByText(/beschreibung/i);
    screen.getByText(mockedData.resources[0].descriptionOnlyText);

    screen.getByText(/verfügbarkeit/i);
    screen.getByText(/daten werden langfristig erhältlich bleiben \(stable\)/i);

    screen.getByText(/lizenz/i);
    screen.getByText(/freie nutzung/i);
  });

  it("should behave correctly on expand", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ResourceTableMobile data={getMockedData()} />,
    );

    const link = screen.getByRole("link", {
      name: /mehr informationen anzeigen/i,
    });
    const dl = container.querySelector("#id");

    expect(link.getAttribute("aria-expanded")).toBe("false");
    expect(link.textContent).toBe("mehr Informationen anzeigen");
    expect(dl?.getAttribute("aria-hidden")).toBe("true");

    await act(() => user.click(link));

    expect(link.getAttribute("aria-expanded")).toBe("true");
    expect(link.textContent).toBe("weniger Informationen anzeigen");
    expect(dl?.getAttribute("aria-hidden")).toBe("false");
  });

  it("should not render a description if not available", () => {
    const mockedData = getMockedData(); // JSON.parse(JSON.stringify(mockedData));

    mockedData.resources[0].descriptionOnlyText = "";

    render(<ResourceTableMobile data={mockedData} />);

    expect(screen.queryByText(/beschreibung/i)).toBeNull();
    expect(screen.queryByText(/descriptionOnlyText/i)).toBeNull();
  });

  it("should not render a license if not available", () => {
    const mockedData = getMockedData();
    mockedData.resources[0].license = undefined;

    render(<ResourceTableMobile data={mockedData} />);

    expect(screen.queryByText(/lizenz/i)).toBeNull();
    expect(screen.queryByText(/freie Nutzung/i)).toBeNull();
    expect(screen.queryByText(/eingeschränkte nutzung/i)).toBeNull();
  });

  it("should not render a availability if not available", () => {
    const mockedData = getMockedData();
    mockedData.resources[0].shortendAvailability = undefined;

    render(<ResourceTableMobile data={mockedData} />);

    expect(screen.queryByText(/verfügbarkeit/i)).toBeNull();
    expect(
      screen.queryByText(/daten werden langfristig erhältlich bleiben/i),
    ).toBeNull();
  });

  it("should render the correct label for open licences", () => {
    let mockedData = getMockedData();

    // @ts-ignore
    mockedData.resources[0].license.open = true;

    const { rerender } = render(<ResourceTableMobile data={mockedData} />);

    screen.getByText(/freie nutzung/i);
    expect(screen.queryByText(/eingeschränkte nutzung/i)).toBeNull();

    // @ts-ignore
    mockedData.resources[0].license.open = false;
    act(() => rerender(<ResourceTableMobile data={mockedData} />));

    expect(screen.queryByText(/freie nutzung/i)).toBeNull();
    screen.getByText(/eingeschränkte nutzung/i);
  });

  it("stable not stable", () => {
    const { rerender } = render(<ResourceTableMobile data={getMockedData()} />);

    screen.getByText(/daten werden langfristig erhältlich bleiben \(stable\)/i);

    const mockData = getMockedData();
    mockData.resources[0].shortendAvailability = "EXPERIMENTAL";
    act(() => rerender(<ResourceTableMobile data={mockData} />));

    screen.getByText(
      /daten versuchsweise und nur für kurze zeit verfügbar \(experimental\)/i,
    );
  });

  it("should render an info badge if link is not available", () => {
    const mockedData = getMockedData();

    mockedData.notAvailableResourceLinks = ["/id"];
    render(<ResourceTableMobile data={mockedData} />);

    screen.getByRole("alert");
  });

  // todo
  it.skip("should render a fallback for the title", () => {
    const mockedData = getMockedData();

    mockedData.resources[0].nameOnlyText = "";
    render(<ResourceTableMobile data={mockedData} />);

    screen.getByRole("heading", {
      name: /JSON-Ressource/,
    });
  });
});
