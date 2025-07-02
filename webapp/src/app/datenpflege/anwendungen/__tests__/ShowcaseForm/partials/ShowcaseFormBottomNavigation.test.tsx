import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { ShowcaseFormBottomNavigation } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/partials/ShowcaseFormBottomNavigation";

describe("ShowcaseFormBottomNavigation", () => {
  test("should render correct buttons", () => {
    render(<ShowcaseFormBottomNavigation submitButtonTitle={"speichern"} />);

    const submitBtn = screen.queryByRole("button", { name: "speichern" });
    const cancelLink = screen.queryByRole("link", { name: "Abbrechen" });

    expect(cancelLink).toBeVisible();
    expect(submitBtn).toBeVisible();
    expect(submitBtn).toHaveAttribute("id", "showcase-form-submit-button");
  });
});
