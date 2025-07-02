import { describe, expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { MetadataFormNavigationError } from "@/app/datenpflege/metadaten/_components/MetadataForm/partials/MetadataFormNavigationError";

describe("MetadataFormNavigationError", () => {
  test("should render correct alert for error", () => {
    render(<MetadataFormNavigationError step={3} />);

    const alert = screen.getByRole("alert");

    const srOnlyText = within(alert).getByText("Abschnitt 3");
    expect(srOnlyText).toHaveClass("sr-only");

    const visualText = within(alert).getByText("Angaben enthalten Fehler");
    expect(visualText).toBeVisible();
  });
});
