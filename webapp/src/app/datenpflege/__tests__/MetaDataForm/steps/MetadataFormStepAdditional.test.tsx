import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetadataFormStepAdditional } from "@/app/datenpflege/_components/MetaDataForm/steps/MetadataFormStepAdditional";
import { METADATA_FORM_MAX_LENGTH_LONG } from "@/app/datenpflege/_components/MetaDataForm/formConstants";

describe("MetadataFormStepAdditional", () => {
  const commonStepProps = {
    forStep: 0,
    currentStep: 0,
  };

  const getTextBox = () =>
    screen.getByRole("textbox", {
      name: /rechtsgrundlage für zugangseröffnung/i,
    });

  test("should render correct markup", () => {
    render(<MetadataFormStepAdditional {...commonStepProps} />);
    screen.getByRole("heading", { name: "Weitere Angaben", level: 2 });

    const textbox = getTextBox();
    expect(textbox).toHaveDisplayValue("");
    expect(textbox).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_LONG.toString(),
    );
  });

  test("should render with prefilled inputs", () => {
    render(
      <MetadataFormStepAdditional
        {...commonStepProps}
        defaultLegalBasisText={["Testinput", "foo"]}
      />,
    );
    const textbox = getTextBox();
    expect(textbox).toHaveDisplayValue("Testinput, foo");
  });
});
