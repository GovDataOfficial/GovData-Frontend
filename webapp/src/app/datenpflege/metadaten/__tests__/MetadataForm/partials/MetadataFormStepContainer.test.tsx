import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import { MetadataFormStepContainer } from "@/app/datenpflege/metadaten/_components/MetadataForm/partials/MetadataFormStepContainer";

describe("MetadataFormStepContainer", () => {
  test("should render hidden if not current", () => {
    const { container } = render(
      <MetadataFormStepContainer forStep={0} currentStep={1} headline="TEST">
        <div>hey</div>
      </MetadataFormStepContainer>,
    );

    expect(container.querySelector(".step-container")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  test("should render not hidden if current", () => {
    const { container } = render(
      <MetadataFormStepContainer forStep={0} currentStep={0} headline="TEST">
        <div>hey</div>
      </MetadataFormStepContainer>,
    );

    expect(container.querySelector(".step-container")).toHaveAttribute(
      "aria-hidden",
      "false",
    );

    screen.getByText("hey");
  });

  test("should render correct headling levels for steps", () => {
    const { rerender } = render(
      <MetadataFormStepContainer forStep={0} currentStep={0} headline="TEST" />,
    );

    screen.getByRole("heading", { name: "TEST", level: 2 });

    rerender(
      <MetadataFormStepContainer forStep={0} currentStep={7} headline="TEST" />,
    );

    screen.getByRole("heading", { name: "TEST", level: 3 });
  });
});
