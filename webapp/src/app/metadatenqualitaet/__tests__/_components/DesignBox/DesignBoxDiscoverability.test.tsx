import { beforeAll, describe, expect, it, vi } from "vitest";
import { MetaDataQualityTestProps } from "@/app/metadatenqualitaet/__tests__/test.props";
import { render, screen } from "@testing-library/react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { DesignBoxDiscoverability } from "@/app/metadatenqualitaet/_components/DesignBox/DesignBoxDiscoverability";
import userEvent from "@testing-library/user-event";
import * as createChartData from "@/app/metadatenqualitaet/_components/Charts/createChartData";

vi.mock("chart.js");
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("DesignBoxDiscoverability", () => {
  const filter = "foo=1&publisher=pubId&test=2&f=";
  const paramsEmpty = new URLSearchParams() as ReadonlyURLSearchParams;
  const paramsFilter = new URLSearchParams(filter) as ReadonlyURLSearchParams;

  beforeAll(() => {
    vi.mocked(useSearchParams).mockReturnValue(paramsEmpty);
  });

  it("should render correct headline", async () => {
    render(<DesignBoxDiscoverability data={MetaDataQualityTestProps} />);
    screen.getByRole("heading", {
      name: /übersicht auffindbarkeit/i,
      level: 2,
    });
  });

  it("should render info icon", async () => {
    const user = userEvent.setup();
    render(<DesignBoxDiscoverability data={MetaDataQualityTestProps} />);
    const button = screen.getByRole("button", {
      name: /erklärungen zu den kennzahlen einblenden/i,
      expanded: false,
    });

    await user.click(button);
    screen.getByText(/keywords vorhanden: keywords sind wichtig/i);
  });

  it("should call createChartData without publisher param", async () => {
    const createChartDataSpy = vi.spyOn(createChartData, "createChartData");

    render(<DesignBoxDiscoverability data={MetaDataQualityTestProps} />);
    await screen.findByRole("img", { name: /auffindbarkeit/i });
    expect(createChartDataSpy).toHaveBeenLastCalledWith(
      MetaDataQualityTestProps,
      "discoverability",
      undefined,
    );
  });

  it("should call createChartData with publisher param", async () => {
    const createChartDataSpy = vi.spyOn(createChartData, "createChartData");
    vi.mocked(useSearchParams).mockReturnValue(paramsFilter);

    render(<DesignBoxDiscoverability data={MetaDataQualityTestProps} />);
    await screen.findByRole("img", { name: /auffindbarkeit/i });

    expect(createChartDataSpy).toHaveBeenLastCalledWith(
      MetaDataQualityTestProps,
      "discoverability",
      "pubId",
    );
  });
});
