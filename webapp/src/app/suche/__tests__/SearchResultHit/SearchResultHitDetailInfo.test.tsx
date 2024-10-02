import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SearchResultHitDetailInfo } from "@/app/suche/_components/SearchResultHit/SearchResultHitDetailInfo";
import { MetaDataResource } from "@/types/types";

const mockedData = [
  { format: "_mock.csv" },
  { format: "_mock.json" },
] as MetaDataResource[];

describe("SearchResultHitDetailInfo", () => {
  it("should render empty", () => {
    const { container } = render(<SearchResultHitDetailInfo hasHvd={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should with HVD and without resources", () => {
    render(<SearchResultHitDetailInfo hasHvd={true} />);

    const dt = screen.getByRole("term");
    expect(dt).toHaveTextContent("Auszeichnung");
    expect(dt).toHaveClass("sr-only");

    const dd = screen.getByRole("definition");
    expect(dd).toHaveTextContent("HVD");
  });

  it("should render with resources", () => {
    render(<SearchResultHitDetailInfo hasHvd={false} resources={mockedData} />);

    const dt = screen.getByRole("term");
    expect(dt).toHaveTextContent("Dateiformate");
    expect(dt).toHaveClass("sr-only");

    const dds = screen.getAllByRole("definition");
    expect(dds[0]).toHaveTextContent("_mock.csv");
    expect(dds[1]).toHaveTextContent("_mock.json");
  });

  it("should render with contact", () => {
    render(<SearchResultHitDetailInfo hasHvd={false} contact="TolleStelle" />);

    const dt = screen.getByRole("term");
    expect(dt).toHaveTextContent("veröffentlichende Stelle");
    expect(dt).toHaveClass("sr-only");

    const dd = screen.getByRole("definition");
    expect(dd).toHaveTextContent("TolleStelle");
  });

  it("should render all information", () => {
    render(
      <SearchResultHitDetailInfo
        hasHvd={true}
        resources={mockedData}
        contact="TolleStelle"
      />,
    );

    const dts = screen.getAllByRole("term");
    expect(dts).toHaveLength(3);
    expect(dts[0]).toHaveTextContent("Dateiformate");
    expect(dts[1]).toHaveTextContent("Auszeichnung");
    expect(dts[2]).toHaveTextContent("veröffentlichende Stelle");
  });
});
