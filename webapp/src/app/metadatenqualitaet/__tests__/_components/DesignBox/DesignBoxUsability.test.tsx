import { beforeAll, describe, expect, it, vi } from "vitest";
import { MetaDataQualityTestProps } from "@/app/metadatenqualitaet/__tests__/test.props";
import { render, screen } from "@testing-library/react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import userEvent from "@testing-library/user-event";
import { DesignBoxUsability } from "@/app/metadatenqualitaet/_components/DesignBox/DesignBoxUsability";
import * as createChartData from "@/app/metadatenqualitaet/_components/Charts/createChartData";

vi.mock("chart.js");

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("DesignBoxUsability", () => {
  const filter = "foo=1&publisher=pubId&test=2&f=";
  const paramsEmpty = new URLSearchParams() as ReadonlyURLSearchParams;
  const paramsFilter = new URLSearchParams(filter) as ReadonlyURLSearchParams;

  beforeAll(() => {
    vi.mocked(useSearchParams).mockReturnValue(paramsEmpty);
  });

  it("should render correct headline", async () => {
    render(<DesignBoxUsability data={MetaDataQualityTestProps} />);
    screen.getByRole("heading", {
      name: /übersicht weiterverwendbarkeit/i,
      level: 2,
    });
  });

  it("should render info icon", async () => {
    const user = userEvent.setup();
    render(<DesignBoxUsability data={MetaDataQualityTestProps} />);
    const button = screen.getByRole("button", {
      name: /erklärungen zu den kennzahlen einblenden/i,
      expanded: false,
    });

    await user.click(button);
    screen.getByText(/die angabe von lizenzen ist zwingend notwendig/i);
  });

  it("should call createChartData without publisher param", async () => {
    const createChartDataSpy = vi.spyOn(createChartData, "createChartData");
    render(<DesignBoxUsability data={MetaDataQualityTestProps} />);
    await screen.findByRole("img");
    expect(createChartDataSpy).toHaveBeenLastCalledWith(
      MetaDataQualityTestProps,
      "usability",
      undefined,
    );
  });

  it("should call createChartData with publisher param", async () => {
    const createChartDataSpy = vi.spyOn(createChartData, "createChartData");
    vi.mocked(useSearchParams).mockReturnValue(paramsFilter);

    render(<DesignBoxUsability data={MetaDataQualityTestProps} />);
    await screen.findByRole("img");
    expect(createChartDataSpy).toHaveBeenLastCalledWith(
      MetaDataQualityTestProps,
      "usability",
      "pubId",
    );
  });
});
