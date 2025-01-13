import { describe, expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { MetaDataFormRequestError } from "@/app/datenpflege/_components/MetaDataForm/partials/MetadataFormRequestError";
import { RequestError } from "@/app/datenpflege/_components/MetaDataForm/useMetadataForm";

describe("MetaDataFormRequestError", () => {
  test("should render correct alert for general error", () => {
    const testMail = "test@mail.com";
    render(
      <MetaDataFormRequestError
        requestError={RequestError.general}
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
      <MetaDataFormRequestError requestError={RequestError.duplicateTitle} />,
    );

    const alert = screen.getByRole("alert");
    within(alert).getByText("Es existiert bereits ein Datensatz", {
      exact: false,
    });
  });

  test("should render correct alert for deleted data error", () => {
    render(
      <MetaDataFormRequestError requestError={RequestError.dataDeleted} />,
    );

    const alert = screen.getByRole("alert");
    within(alert).getAllByText(
      "Der Datensatz ist leider nicht mehr verfügbar.",
      {
        exact: false,
      },
    );
  });
});
