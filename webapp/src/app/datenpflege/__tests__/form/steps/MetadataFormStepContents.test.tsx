import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetadataFormStepContents } from "@/app/datenpflege/metadaten/form/steps/MetadataFormStepContents";
import { METADATA_FORM_INPUTS } from "@/app/datenpflege/metadaten/form/formConstants";

describe("MetadataFormStepData", () => {
  test("should render correct headline", () => {
    render(<MetadataFormStepContents forStep={0} currentStep={0} />);
    screen.getByRole("heading", { name: "Angaben zum Inhalt", level: 2 });
  });

  test("should render correct inputs with name", () => {
    render(<MetadataFormStepContents forStep={0} currentStep={0} />);

    const title = screen.getByRole("textbox", { name: /titel/i });
    expect(title).toHaveAttribute("name", METADATA_FORM_INPUTS.TITLE);

    const description = screen.getByRole("textbox", { name: /beschreibung/i });
    expect(description).toHaveAttribute(
      "name",
      METADATA_FORM_INPUTS.DESCRIPTION,
    );

    const tags = screen.getByRole("textbox", { name: /schlagwörter/i });
    expect(tags).toHaveAttribute("name", METADATA_FORM_INPUTS.TAGS);

    screen.getByRole("group", { name: "Kategorien (empfohlen)" });
    screen.getByRole("group", { name: "Hochwertige Datensatzkategorien" });

    const website = screen.getByRole("textbox", {
      name: /webseite mit weiteren informationen zu den daten/i,
    });
    expect(website).toHaveAttribute("name", METADATA_FORM_INPUTS.WEBSITE);
  });
});
