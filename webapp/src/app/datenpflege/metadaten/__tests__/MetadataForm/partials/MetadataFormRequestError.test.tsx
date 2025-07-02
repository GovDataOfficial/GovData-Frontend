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
});
