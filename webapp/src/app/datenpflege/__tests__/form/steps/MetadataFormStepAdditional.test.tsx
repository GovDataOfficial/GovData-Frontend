import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetadataFormStepAdditional } from "@/app/datenpflege/metadaten/form/steps/MetadataFormStepAdditional";
import { METADATA_FORM_INPUTS } from "@/app/datenpflege/metadaten/form/formConstants";

describe("MetadataFormStepAdditional", () => {
  test("should render correct headline", () => {
    render(<MetadataFormStepAdditional forStep={0} currentStep={0} />);
    screen.getByRole("heading", { name: "Weitere Angaben", level: 2 });
  });

  test("should render correct inputs with name", () => {
    render(<MetadataFormStepAdditional forStep={0} currentStep={0} />);
    const input = screen.getByRole("textbox", {
      name: /rechtsgrundlage für zugangseröffnung/i,
    });

    expect(input).toHaveAttribute(
      "name",
      METADATA_FORM_INPUTS.LEGAL_BASIS_TEXT,
    );
  });
});
