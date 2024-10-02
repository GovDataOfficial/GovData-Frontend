import { beforeEach, describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../page";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("Sparql Page", () => {
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
