import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import { Metadata, ResourceFormatShort } from "@/types/types";

import { ResourceTableMobile } from "../../_components/ResourceTable/ResourceTableMobile";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
  usePathname: vi.fn().mockReturnValue({
    getAll: vi.fn(),
  }),
  useRouter: vi.fn(),
}));

vi.mock(
  "@/app/suche/_components/ResourceTable/ResourcePreview/ResourcePreview",
  () => {
    const DtResourcePreview = () => <div tabIndex={0}>ResourcePreview</div>;
    return { DtResourcePreview };
  },
);

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

const getExpandLink = () => {
  return screen.getByRole("link", {
    name: /mehr informationen anzeigen/i,
  });
};

describe("ResourceTableMobile", () => {
  const tileUrl = "https://tile.url";

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as ReadonlyURLSearchParams,
    );
  });

  it("should render correctly", () => {
    const mockedData = getMockedData();

    render(<ResourceTableMobile data={mockedData} tileUrl={tileUrl} />);

    screen.getByText(/nameOnlyText/i);
    screen.getByRole("link", { name: /mehr informationen anzeigen/i });

    screen.getByText(/letzte änderung/i);
    screen.getByText(mockedData.resources[0].modified);

    screen.getByText(/dateiformat/i);
    screen.getByText(mockedData.resources[0].formatShort);

    expect(screen.queryByText(/beschreibung/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(mockedData.resources[0].descriptionOnlyText),
    ).not.toBeInTheDocument();

    expect(screen.queryByText(/verfügbarkeit/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /daten werden langfristig erhältlich bleiben \(stable\)/i,
      ),
    ).not.toBeInTheDocument();

    expect(screen.queryByText(/lizenz/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/freie nutzung/i)).not.toBeInTheDocument();

    screen.getByText(/ressourcenlink in zwischenablage kopieren/i);
  });

  it("should behave correctly on expand", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ResourceTableMobile data={getMockedData()} tileUrl={tileUrl} />,
    );

    const link = getExpandLink();
    const dl = container.querySelector("#id");

    expect(link.getAttribute("aria-expanded")).toBe("false");
    expect(link.textContent).toBe("mehr Informationen anzeigen");
    expect(dl).not.toBeInTheDocument();

    await act(() => user.click(link));

    expect(link.getAttribute("aria-expanded")).toBe("true");
    expect(link.textContent).toBe("weniger Informationen anzeigen");
  });

  it("should not render a description if not available", async () => {
    const user = userEvent.setup();
    const mockedData = getMockedData(); // JSON.parse(JSON.stringify(mockedData));

    mockedData.resources[0].descriptionOnlyText = "";

    render(<ResourceTableMobile data={mockedData} tileUrl={tileUrl} />);

    await act(() => user.click(getExpandLink()));

    expect(screen.queryByText(/beschreibung/i)).toBeNull();
    expect(screen.queryByText(/descriptionOnlyText/i)).toBeNull();
  });

  it("should not render a license if not available", async () => {
    const user = userEvent.setup();
    const mockedData = getMockedData();
    mockedData.resources[0].license = undefined;

    render(<ResourceTableMobile data={mockedData} tileUrl={tileUrl} />);

    await act(() => user.click(getExpandLink()));

    expect(screen.queryByText(/lizenz/i)).toBeNull();
    expect(screen.queryByText(/freie Nutzung/i)).toBeNull();
    expect(screen.queryByText(/eingeschränkte nutzung/i)).toBeNull();
  });

  it("should not render a availability if not available", async () => {
    const user = userEvent.setup();
    const mockedData = getMockedData();
    mockedData.resources[0].shortendAvailability = undefined;

    render(<ResourceTableMobile data={mockedData} tileUrl={tileUrl} />);
    await act(() => user.click(getExpandLink()));

    expect(screen.queryByText(/verfügbarkeit/i)).toBeNull();
    expect(
      screen.queryByText(/daten werden langfristig erhältlich bleiben/i),
    ).toBeNull();
  });

  it("should render the correct label for open licences", async () => {
    const user = userEvent.setup();
    let mockedData = getMockedData();

    // @ts-ignore
    mockedData.resources[0].license.open = true;

    const { rerender } = render(
      <ResourceTableMobile data={mockedData} tileUrl={tileUrl} />,
    );
    await act(() => user.click(getExpandLink()));

    screen.getByText(/freie nutzung/i);
    expect(screen.queryByText(/eingeschränkte nutzung/i)).toBeNull();

    // @ts-ignore
    mockedData.resources[0].license.open = false;
    await act(() =>
      rerender(<ResourceTableMobile data={mockedData} tileUrl={tileUrl} />),
    );

    expect(screen.queryByText(/freie nutzung/i)).toBeNull();
    screen.getByText(/eingeschränkte nutzung/i);
  });

  it("stable not stable", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ResourceTableMobile data={getMockedData()} tileUrl={tileUrl} />,
    );

    await user.click(getExpandLink());

    screen.getByText(/daten werden langfristig erhältlich bleiben \(stable\)/i);

    const mockData = getMockedData();
    mockData.resources[0].shortendAvailability = "EXPERIMENTAL";
    await act(() =>
      rerender(<ResourceTableMobile data={mockData} tileUrl={tileUrl} />),
    );

    screen.getByText(
      /daten versuchsweise und nur für kurze zeit verfügbar \(experimental\)/i,
    );
  });

  it("should render an info badge if link is not available", () => {
    const mockedData = getMockedData();

    mockedData.notAvailableResourceLinks = ["/id"];
    render(<ResourceTableMobile data={mockedData} tileUrl={tileUrl} />);

    screen.getByRole("alert");
  });

  it("should render a fallback for the title", () => {
    const mockedData = getMockedData();

    mockedData.resources[0].nameOnlyText = "";
    render(<ResourceTableMobile data={mockedData} tileUrl={tileUrl} />);
    screen.getByText("JSON-Ressource");
  });

  it("should behave correctly on preview icon click", async () => {
    const user = userEvent.setup();

    const data = getMockedData();
    data.resources[0] = {
      ...data.resources[0],
      formatShort: ResourceFormatShort.geojson,
    };

    const { container } = render(
      <ResourceTableMobile data={data} tileUrl={tileUrl} />,
    );

    const link = getExpandLink();
    const dl = container.querySelector("#id");

    expect(link.getAttribute("aria-expanded")).toBe("false");
    expect(dl).not.toBeInTheDocument();

    const previewIcon = screen.getAllByRole("button")[0];
    await user.click(previewIcon);

    expect(link.getAttribute("aria-expanded")).toBe("true");
    expect(link.textContent).toBe("weniger Informationen anzeigen");

    const preview = screen.getByText(/resourcepreview/i);
    expect(preview).toBeInTheDocument();
  });

  it("should behave correctly on preview icon click twice", async () => {
    const user = userEvent.setup();

    const data = getMockedData();
    data.resources[0] = {
      ...data.resources[0],
      formatShort: ResourceFormatShort.geojson,
    };

    const { container } = render(
      <ResourceTableMobile data={data} tileUrl={tileUrl} />,
    );

    const link = getExpandLink();
    const dl = container.querySelector("#id");

    expect(link.getAttribute("aria-expanded")).toBe("false");
    expect(dl).not.toBeInTheDocument();

    const previewIcon = screen.getAllByRole("button")[0];
    await user.click(previewIcon);
    await user.click(previewIcon);

    expect(link.getAttribute("aria-expanded")).toBe("true");
    expect(link.textContent).toBe("weniger Informationen anzeigen");
    expect(dl).not.toBeInTheDocument();

    screen.getByText(/resourcepreview/i);
  });
});
