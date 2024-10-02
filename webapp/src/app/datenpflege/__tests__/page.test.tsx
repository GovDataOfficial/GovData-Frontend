import Page, { metadata } from "../page";
import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

describe("Landing Page", () => {
  test("should render a link to create Metadata", () => {
    render(<Page />);

    const link = screen.getByRole("link");
    expect(link).toHaveTextContent("Metadatensatz erstellen");
  });

  test("should have correct meta info", () => {
    expect(metadata.title).toBe("Datenpflege - GovData");
  });
});
