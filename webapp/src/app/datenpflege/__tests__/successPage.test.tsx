import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import SuccessPage, { metadata } from "../metadaten/erstellen/erfolgreich/page";

describe("MetaData SuccessPage", () => {
  test("should correct markup", () => {
    render(<SuccessPage />);
    screen.getByRole("heading", {
      name: /metadatensatz erfolgreich übermittelt/i,
      level: 1,
    });
  });

  test("should generate correct metadata", () => {
    expect(metadata.title).toBe(
      "Metadatensatz erfolgreich übermittelt - GovData",
    );
  });
});
