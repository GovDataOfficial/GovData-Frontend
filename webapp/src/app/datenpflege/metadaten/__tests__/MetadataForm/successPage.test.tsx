import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import SuccessPage, { metadata } from "../../erstellen/erfolgreich/page";

describe("Metadata SuccessPage", () => {
  test("should correct markup", () => {
    render(<SuccessPage />);
    screen.getByRole("heading", {
      name: /metadatensatz erfolgreich veröffentlicht/i,
      level: 1,
    });
  });

  test("should generate correct metadata", () => {
    expect(metadata.title).toContain(
      "Metadatensatz erfolgreich veröffentlicht",
    );
  });
});
