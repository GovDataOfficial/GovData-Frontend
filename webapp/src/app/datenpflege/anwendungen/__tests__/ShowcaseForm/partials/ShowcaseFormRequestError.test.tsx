import { describe, test } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { ShowcaseFormRequestError } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/partials/ShowcaseFormRequestError";
import { ShowcaseRequestError } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/useShowcaseForm";

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
});
