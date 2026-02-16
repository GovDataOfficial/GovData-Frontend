import { describe, expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import { ShowcaseFormRequestError } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/partials/ShowcaseFormRequestError";
import { ShowcaseRequestError } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/useShowcaseForm";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => PAGES_AUTH.manage_showcases_form_add),
  useSearchParams: vi.fn(() => ({
    toString: () => "",
  })),
}));

describe("ShowcaseFormRequestError", () => {
  test("should render correct alert for general error", () => {
    render(
      <ShowcaseFormRequestError requestError={ShowcaseRequestError.general} />,
    );

    const alert = screen.getByRole("alert");

    within(alert).getByText("Es ist ein Fehler aufgetreten", {
      exact: false,
    });
  });

  test("should render correct alert for deleted data error", () => {
    render(
      <ShowcaseFormRequestError
        requestError={ShowcaseRequestError.dataDeleted}
      />,
    );

    const alert = screen.getByRole("alert");
    within(alert).getAllByText(
      "Die Anwendung ist leider nicht mehr verfügbar.",
      {
        exact: false,
      },
    );
  });

  test("should render correct alert for session timeout error with login link", () => {
    render(
      <ShowcaseFormRequestError
        requestError={ShowcaseRequestError.sessionTimeout}
      />,
    );

    const alert = screen.getByRole("alert");
    within(alert).getByText("Ihre Sitzung ist abgelaufen", { exact: false });

    const loginLink = within(alert).getByRole("link", {
      name: "melden Sie sich erneut an",
    });
    expect(loginLink).toHaveAttribute(
      "href",
      `${API_ENDPOINTS.AUTH.LOGIN}?redirectTo=${encodeURIComponent(PAGES_AUTH.manage_showcases_form_add)}`,
    );
  });

  test("should render correct alert for forbidden error", () => {
    render(
      <ShowcaseFormRequestError
        requestError={ShowcaseRequestError.forbidden}
      />,
    );

    const alert = screen.getByRole("alert");
    within(alert).getAllByText("Fehlende Berechtigung", {
      exact: false,
    });
  });
});
