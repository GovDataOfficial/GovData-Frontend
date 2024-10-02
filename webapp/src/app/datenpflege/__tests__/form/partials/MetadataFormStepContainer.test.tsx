import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetaDataFormStepContainer } from "@/app/datenpflege/metadaten/form/partials/MetaDataFormStepContainer";

describe("MetaDataFormStepContainer", () => {
  test("should render hidden if not current", () => {
    const { container } = render(
      <MetaDataFormStepContainer forStep={0} currentStep={1} headline="TEST">
        <div>hey</div>
      </MetaDataFormStepContainer>,
    );

    expect(container.querySelector(".step-container")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  test("should render not hidden if current", () => {
    const { container } = render(
      <MetaDataFormStepContainer forStep={0} currentStep={0} headline="TEST">
        <div>hey</div>
      </MetaDataFormStepContainer>,
    );

    expect(container.querySelector(".step-container")).toHaveAttribute(
      "aria-hidden",
      "false",
    );

    screen.getByText("hey");
  });

  test("should render correct headling levels for steps", () => {
    const { rerender } = render(
      <MetaDataFormStepContainer forStep={0} currentStep={0} headline="TEST" />,
    );

    screen.getByRole("heading", { name: "TEST", level: 2 });

    rerender(
      <MetaDataFormStepContainer forStep={0} currentStep={7} headline="TEST" />,
    );

    screen.getByRole("heading", { name: "TEST", level: 3 });
  });
});
