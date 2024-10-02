import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { showCaseTestData } from "../props";
import { SearchDetailsInfoboxApplication } from "@/app/suche/_components/SearchDetailsInfobox/SearchDetailsInfoboxApplication";

describe("SearchDetailsInfoboxApplication", () => {
  it("should render correct headline", async () => {
    render(<SearchDetailsInfoboxApplication data={showCaseTestData} />);
    screen.getByRole("heading", { name: /details zur anwendung/i, level: 2 });

    const dterms = screen.getAllByRole("term");

    expect(dterms).toHaveLength(4);
    expect(dterms[0]).toHaveTextContent("Typ");
    expect(dterms[1]).toHaveTextContent("System");
    expect(dterms[2]).toHaveTextContent("Kategorien");
    expect(dterms[3]).toHaveTextContent("Schlagwörter");
  });
});
