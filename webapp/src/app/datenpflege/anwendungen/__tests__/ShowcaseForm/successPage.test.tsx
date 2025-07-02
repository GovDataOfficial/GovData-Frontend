import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import SuccessPage, {
  metadata,
} from "@/app/datenpflege/anwendungen/erstellen/erfolgreich/page";

describe("Showcase SuccessPage", () => {
  test("should correct markup", () => {
    render(<SuccessPage />);
    screen.getByRole("heading", {
      name: /anwendung erfolgreich veröffentlicht/i,
      level: 1,
    });
  });

  test("should generate correct metadata", () => {
    expect(metadata.title).toBe(
      "Anwendung erfolgreich veröffentlicht - GovData",
    );
  });
});
