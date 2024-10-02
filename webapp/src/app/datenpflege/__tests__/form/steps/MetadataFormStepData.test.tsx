import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { METADATA_FORM_INPUTS } from "@/app/datenpflege/metadaten/form/formConstants";
import { MetadataFormStepData } from "@/app/datenpflege/metadaten/form/steps/MetadataFormStepData";

describe("MetadataFormStepData", () => {
  test("should render correct headline", () => {
    render(<MetadataFormStepData forStep={0} currentStep={0} />);
    screen.getByRole("heading", { name: "Datenbereitsteller", level: 2 });
  });

  test("should render correct inputs with name", () => {
    render(<MetadataFormStepData forStep={0} currentStep={0} />);

    const input1 = screen.getByRole("textbox", {
      name: /datenbereitstellende organisation/i,
    });

    expect(input1).toHaveAttribute("name", METADATA_FORM_INPUTS.DATA_ORG);

    const input2 = screen.getByRole("textbox", {
      name: /govdata\-contributorid/i,
    });
    expect(input2).toHaveAttribute("name", METADATA_FORM_INPUTS.CONTRIBUTER_ID);
  });
});
