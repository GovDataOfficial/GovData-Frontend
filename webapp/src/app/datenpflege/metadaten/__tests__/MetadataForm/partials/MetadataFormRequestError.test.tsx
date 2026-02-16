import { describe, expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { MetadataFormRequestError } from "@/app/datenpflege/metadaten/_components/MetadataForm/partials/MetadataFormRequestError";
import { MetadataRequestError } from "@/app/datenpflege/metadaten/_components/MetadataForm/useMetadataForm";

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
});
