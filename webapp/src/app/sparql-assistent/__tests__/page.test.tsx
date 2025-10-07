import { beforeAll, beforeEach, describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

import Page from "../page";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

vi.mock("@/app/sparql-assistent/SparqlEditor/hooks/useYasgui", () => ({
  useYasgui: vi.fn(() => ({
    yasgui: null,
    setQuery: vi.fn(),
    setPrefixes: vi.fn(),
    togglePrefix: vi.fn(),
    loaded: false,
    execQuery: vi.fn(),
    setContentType: vi.fn(),
    setEndpoint: vi.fn(),
    renderContainer: () => (
      <div id="yasgui" className="col-12 custom-sparql-layout" />
    ),
  })),
}));

describe("Sparql Page", () => {
  beforeAll(() => {
    vi.stubEnv("GD_SPARQL_DS", "https://example.com/sparql");
    vi.stubEnv("GD_SPARQL_MQA", "https://example.com/mqa");
  });
  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as ReadonlyURLSearchParams,
    );
  });

  it("should all content sections", () => {
    render(<Page />);

    screen.getByRole("heading", { name: "SPARQL-Assistent", level: 1 });
    screen.getByRole("heading", { name: "Schnittstellen", level: 2 });
    screen.getByRole("heading", { name: "SPARQL-Assistent", level: 2 });
    screen.getByRole("heading", { name: "Endpunkt:", level: 3 });
    screen.getByRole("heading", { name: "Beispiel-Abfragen:", level: 3 });
    screen.getByRole("heading", { name: "Prefixes hinzufügen:", level: 3 });
    screen.getByRole("heading", { name: "Ergebnisformat:", level: 3 });
  });
});
