import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SearchResultHit } from "@/app/suche/_components/SearchResultHit/SearchResultHit";
import { SearchResultHit as SearchResultHitType } from "@/types/types";

const mockedHit = {
  id: "id",
  name: "mock",
  content: "mocked content",
  hasHvd: false,
  resources: [],
  title: "Mocked Title",
  type: "dataset",
  lastModified: "never",
  targetLink: "/targetLink",
} as SearchResultHitType;

describe("SearchResultHit", () => {
  it("should render no hvd hits correct", () => {
    render(<SearchResultHit hit={mockedHit} />);

    screen.getByRole("link", { name: /mocked title/i });
    screen.getByText(/mocked content/i);
    screen.getByText(/datensatz/i);

    const hvdClass = document.querySelector(".hvd");
    expect(hvdClass).toBeNull();
  });

  it("should render hvd hits correct", () => {
    mockedHit.hasHvd = true;
    render(<SearchResultHit hit={mockedHit} />);

    screen.getByRole("link", { name: /mocked title/i });
    screen.getByText(/mocked content/i);
    screen.getByText(/datensatz/i);

    const term = screen.getByRole("term");
    const definition = screen.getByRole("definition");

    expect(term).toHaveTextContent("Auszeichnung");
    expect(definition).toHaveTextContent("HVD");

    const hvdClass = document.querySelector(".hvd");
    expect(hvdClass).not.toBeNull();
  });

  it("should render hits with image correct", () => {
    mockedHit.displayImage = "/mocked_imagename";
    render(<SearchResultHit hit={mockedHit} />);

    const imageContainer = document.querySelector(".resultentry-display-image");

    expect(imageContainer).toBeDefined();
  });

  it("should render the correct hit link for type dataset", () => {
    render(<SearchResultHit hit={mockedHit} />);
    const link = screen.getByRole("link", { name: /mocked title/i });
    expect(link).toHaveAttribute("href", "/suche/daten/mock");
  });

  it("should render the correct hit link for type showcase", () => {
    const hit = { ...mockedHit, type: "showcase" };
    render(<SearchResultHit hit={hit} />);
    const link = screen.getByRole("link", { name: /mocked title/i });
    expect(link).toHaveAttribute("href", "/suche/anwendung/mock");
  });

  it("should render the correct hit link for type article", () => {
    const hit = { ...mockedHit, type: "article" };
    render(<SearchResultHit hit={hit} />);
    const link = screen.getByRole("link", { name: /mocked title/i });
    expect(link).toHaveAttribute("href", "/targetLink");
  });

  it("should render the correct hit link for type information", () => {
    const hit = { ...mockedHit, type: "information" };
    render(<SearchResultHit hit={hit} />);
    const link = screen.getByRole("link", { name: /mocked title/i });
    expect(link).toHaveAttribute("href", "/targetLink");
  });

  it("should render contact info", () => {
    const hit = { ...mockedHit, contact: "MeineStelle" };
    render(<SearchResultHit hit={hit} />);
    screen.getByText("MeineStelle");
  });
});
