import { beforeAll, describe, expect, it, vi } from "vitest";
import { MetaDataQualityTestProps } from "@/app/metadatenqualitaet/__tests__/test.props";
import { render, screen } from "@testing-library/react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import userEvent from "@testing-library/user-event";
import * as createChartData from "@/app/metadatenqualitaet/_components/Charts/createChartData";
import { DesignBoxTop5License } from "@/app/metadatenqualitaet/_components/DesignBox/DesignBoxTop5License";

vi.mock("chart.js");

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("DesignBoxTop5License", () => {
  const filter = "foo=1&publisher=pubId&test=2&f=";
  const paramsEmpty = new URLSearchParams() as ReadonlyURLSearchParams;
  const paramsFilter = new URLSearchParams(filter) as ReadonlyURLSearchParams;

  beforeAll(() => {
    vi.mocked(useSearchParams).mockReturnValue(paramsEmpty);
  });

  it("should render correct headline", async () => {
    render(<DesignBoxTop5License data={MetaDataQualityTestProps} />);
    screen.getByRole("heading", {
      name: /top 5 lizenzen/i,
      level: 2,
    });
  });

  it("should render info icon", async () => {
    const user = userEvent.setup();
    render(<DesignBoxTop5License data={MetaDataQualityTestProps} />);
    const button = screen.getByRole("button", {
      name: /erklärungen zu den kennzahlen einblenden/i,
      expanded: false,
    });

    await user.click(button);
    screen.getByText(/die angegebene prozentzahl gibt den anteil/i);
  });

  it("should call createChartData without publisher param", async () => {
    const createChartDataSpy = vi.spyOn(createChartData, "createChartData");
    render(<DesignBoxTop5License data={MetaDataQualityTestProps} />);
    await screen.findByRole("img");

    expect(createChartDataSpy).toHaveBeenLastCalledWith(
      MetaDataQualityTestProps,
      "top_licenses",
      undefined,
    );
  });

  it("should call createChartData with publisher param", async () => {
    const createChartDataSpy = vi.spyOn(createChartData, "createChartData");
    vi.mocked(useSearchParams).mockReturnValue(paramsFilter);

    render(<DesignBoxTop5License data={MetaDataQualityTestProps} />);
    await screen.findByRole("img");

    expect(createChartDataSpy).toHaveBeenLastCalledWith(
      MetaDataQualityTestProps,
      "top_licenses",
      "pubId",
    );
  });
});
