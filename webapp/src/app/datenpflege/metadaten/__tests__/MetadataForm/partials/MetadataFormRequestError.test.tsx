import { describe, expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { PAGES_AUTH } from "@/app/_lib/URLHelper";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import { MetadataFormRequestError } from "@/app/datenpflege/metadaten/_components/MetadataForm/partials/MetadataFormRequestError";
import { MetadataRequestError } from "@/app/datenpflege/metadaten/_components/MetadataForm/useMetadataForm";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => PAGES_AUTH.manage_metadata_form_add),
  useSearchParams: vi.fn(() => ({
    toString: () => "",
  })),
}));

describe("MetadataFormRequestError", () => {
  test("should render correct alert for general error", () => {
    const testMail = "test@mail.com";
    render(
      <MetadataFormRequestError
        requestError={MetadataRequestError.general}
        mailFitko={testMail}
      />,
    );

    const alert = screen.getByRole("alert");

    within(alert).getByText("Es ist ein Fehler aufgetreten", {
      exact: false,
    });
    within(alert).getByText(testMail);
  });

  test("should render correct alert for duplicate title error", () => {
    render(
      <MetadataFormRequestError
        requestError={MetadataRequestError.duplicateTitle}
      />,
    );

    const alert = screen.getByRole("alert");
    within(alert).getByText("Es existiert bereits ein Datensatz", {
      exact: false,
    });
  });

  test("should render correct alert for deleted data error", () => {
    render(
      <MetadataFormRequestError
        requestError={MetadataRequestError.dataDeleted}
      />,
    );

    const alert = screen.getByRole("alert");
    within(alert).getAllByText(
      "Der Datensatz ist leider nicht mehr verfügbar.",
      {
        exact: false,
      },
    );
  });

  test("should render correct alert for validation error", () => {
    render(
      <MetadataFormRequestError
        requestError={MetadataRequestError.validationError}
      />,
    );

    const alert = screen.getByRole("alert");
    within(alert).getAllByText(
      "Bei der Validierung des Formulars ist ein Fehler aufgetreten.",
      {
        exact: false,
      },
    );
  });

  test("should render correct alert for invalid tag error", () => {
    render(
      <MetadataFormRequestError
        requestError={MetadataRequestError.invalidTag}
      />,
    );

    const alert = screen.getByRole("alert");
    within(alert).getAllByText("Die Schlagwörter sind ungültig.", {
      exact: false,
    });
  });

  test("should display formatted timestamp when provided", () => {
    const testMail = "test@mail.com";
    const timestamp = "2026-01-19T10:30:45.123Z";

    render(
      <MetadataFormRequestError
        requestError={MetadataRequestError.general}
        mailFitko={testMail}
        timeStamp={timestamp}
      />,
    );

    const alert = screen.getByRole("alert");
    within(alert).getByText("19.01.2026 um 10:30:45 Uhr (UTC)", {
      exact: false,
    });
  });

  test("should not display timestamp when not provided", () => {
    const testMail = "test@mail.com";

    render(
      <MetadataFormRequestError
        requestError={MetadataRequestError.general}
        mailFitko={testMail}
      />,
    );

    const alert = screen.getByRole("alert");
    expect(
      within(alert).queryByText(/\d{2}\.\d{2}\.\d{4} um \d{2}:\d{2}:\d{2}/),
    ).not.toBeInTheDocument();
  });

  test("should include timestamp in mailto link subject", () => {
    const testMail = "test@mail.com";
    const timestamp = "2026-01-19T10:30:45.123Z";

    render(
      <MetadataFormRequestError
        requestError={MetadataRequestError.general}
        mailFitko={testMail}
        timeStamp={timestamp}
      />,
    );

    const mailLink = screen.getByRole("link", { name: testMail });
    expect(mailLink).toHaveAttribute(
      "href",
      `mailto:${testMail}?subject=${encodeURIComponent(
        `Fehler beim Absenden des Metadatenformulars (${timestamp})`,
      )}`,
    );
  });

  test("should not include subject in mailto link when no timestamp", () => {
    const testMail = "test@mail.com";

    render(
      <MetadataFormRequestError
        requestError={MetadataRequestError.general}
        mailFitko={testMail}
      />,
    );

    const mailLink = screen.getByRole("link", { name: testMail });
    expect(mailLink).toHaveAttribute("href", `mailto:${testMail}`);
  });

  test("should render correct alert for session timeout error with login link", () => {
    render(
      <MetadataFormRequestError
        requestError={MetadataRequestError.sessionTimeout}
      />,
    );

    const alert = screen.getByRole("alert");
    within(alert).getByText("Ihre Sitzung ist abgelaufen", { exact: false });

    const loginLink = within(alert).getByRole("link", {
      name: "melden Sie sich erneut an",
    });
    expect(loginLink).toHaveAttribute(
      "href",
      `${API_ENDPOINTS.AUTH.LOGIN}?redirectTo=${encodeURIComponent(PAGES_AUTH.manage_metadata_form_add)}`,
    );
  });

  test("should render correct alert for forbidden error", () => {
    render(
      <MetadataFormRequestError
        requestError={MetadataRequestError.forbidden}
      />,
    );

    const alert = screen.getByRole("alert");
    within(alert).getByText("Fehlende Berechtigung", { exact: false });
  });
});
