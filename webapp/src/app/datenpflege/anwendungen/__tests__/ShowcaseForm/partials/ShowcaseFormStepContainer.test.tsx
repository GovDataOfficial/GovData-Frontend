import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import { ShowcaseFormStepContainer } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/partials/ShowcaseFormStepContainer";
import { ShowcaseFormStepName } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/showcase-formConstants";

describe("ShowcaseFormStepContainer", () => {
  test("should render", () => {
    const { container } = render(
      <ShowcaseFormStepContainer name={ShowcaseFormStepName.contact}>
        <div>hey</div>
      </ShowcaseFormStepContainer>,
    );
    expect(container.querySelector(".step-container")).toHaveAttribute(
      "id",
      "showcase-form-step-container-contact",
    );
    screen.getByText("Kontakt");
  });
});
