import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Chart } from "@/app/metadatenqualitaet/_components/Charts/Chart";
import { createChartData } from "@/app/metadatenqualitaet/_components/Charts/createChartData";
import { MetaDataQualityTestProps } from "@/app/metadatenqualitaet/__tests__/test.props";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

vi.mock("chart.js");
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("Chart", () => {
  const chartData = createChartData(MetaDataQualityTestProps, "usability");

  beforeAll(() => {
    const paramsEmpty = new URLSearchParams() as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(paramsEmpty);
  });

  it("should render a canvas with role img and a table inside", () => {
    render(<Chart data={chartData} ariaLabel={"Mein Label"} />);
    const canvas = screen.getByRole("img", { name: /mein label/i });
    const table = within(canvas).getByRole("table");
    expect(table).toBeDefined();
  });

  it("should render correct table data", () => {
    render(<Chart data={chartData} ariaLabel={"Mein Label"} />);
    const canvas = screen.getByRole("img", { name: /mein label/i });
    const table = within(canvas).getByRole("table");

    const allheaders = within(table).getAllByRole("columnheader");

    expect(allheaders).toHaveLength(5);
    expect(allheaders[0].textContent).toBe("Mein Label");
    expect(allheaders[1].textContent).toContain("Lizenzangaben");
    expect(allheaders[2].textContent).toContain("Lizenz-URIs");
    expect(allheaders[3].textContent).toContain("Offene Lizenz-URIs");
    expect(allheaders[4].textContent).toContain("Veröffentlichende Stelle");

    const allCells = within(table).getAllByRole("cell");
    expect(allCells).toHaveLength(10); // 10 cells, 5 each row

    expect(allCells[0].textContent).toBe("vorhanden");
    expect(allCells[5].textContent).toBe("nicht vorhanden");
  });
});
