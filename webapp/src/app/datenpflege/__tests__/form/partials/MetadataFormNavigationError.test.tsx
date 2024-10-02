import { describe, expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MetaDataFormNavigationError } from "@/app/datenpflege/metadaten/form/partials/MetaDataFormNavigationError";

describe("MetaDataFormNavigationError", () => {
  test("should render correct alert for error", () => {
    render(<MetaDataFormNavigationError step={3} />);

    const alert = screen.getByRole("alert");

    const srOnlyText = within(alert).getByText("Abschnitt 3");
    expect(srOnlyText).toHaveClass("sr-only");

    const visualText = within(alert).getByText(
      "noch nicht alle Pflichtfelder ausgefüllt.",
    );
    expect(visualText).toBeVisible();
  });
});
