import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  METADATA_FORM_INPUTS,
  METADATA_FORM_MAX_LENGTH_LONG,
  METADATA_FORM_MAX_LENGTH_MEDIUM,
} from "@/app/datenpflege/_components/MetadataForm/formConstants";
import { MetadataFormStepContents } from "@/app/datenpflege/_components/MetadataForm/steps/MetadataFormStepContents";

describe("MetadataFormStepContents", () => {
  const getTitle = () => screen.getByRole("textbox", { name: /titel/i });

  const getDescription = () =>
    screen.getByRole("textbox", { name: /beschreibung/i });

  const getTags = () => screen.getByRole("textbox", { name: /schlagwörter/i });

  test("should render correct headline", () => {
    render(<MetadataFormStepContents forStep={0} currentStep={0} />);
    screen.getByRole("heading", { name: "Angaben zum Inhalt", level: 2 });
  });

  test("should render correct inputs markup", () => {
    render(<MetadataFormStepContents forStep={0} currentStep={0} />);

    const title = getTitle();
    expect(title).toHaveAttribute("name", METADATA_FORM_INPUTS.TITLE);
    expect(title).toHaveDisplayValue("");
    expect(title).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_MEDIUM.toString(),
    );

    const description = getDescription();
    expect(description).toHaveAttribute(
      "name",
      METADATA_FORM_INPUTS.DESCRIPTION,
    );
    expect(description).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_LONG.toString(),
    );
    expect(description).toHaveDisplayValue("");

    const tags = getTags();
    expect(tags).toHaveAttribute("name", METADATA_FORM_INPUTS.TAGS);
    expect(tags).toHaveDisplayValue("");
    expect(description).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_LONG.toString(),
    );

    screen.getByRole("group", { name: "Kategorien (empfohlen)" });
    screen.getByRole("group", { name: "Hochwertige Datensatzkategorien" });

    const website = screen.getByRole("textbox", {
      name: /webseite mit weiteren informationen zu den daten/i,
    });
    expect(website).toHaveAttribute("name", METADATA_FORM_INPUTS.URL);
    expect(website).toHaveAttribute(
      "maxlength",
      METADATA_FORM_MAX_LENGTH_MEDIUM.toString(),
    );
  });

  test("should render inputs with prefilled data", () => {
    render(
      <MetadataFormStepContents
        forStep={0}
        currentStep={0}
        defaultTitle={"testtitle"}
        defaultDescription={"test-description"}
        defaultTags={[
          { name: "tag1", description: "test", count: 1 },
          { name: "tag2", description: "test", count: 1 },
        ]}
      />,
    );

    expect(getTitle()).toHaveDisplayValue("testtitle");
    expect(getDescription()).toHaveDisplayValue("test-description");
    expect(getTags()).toHaveDisplayValue("tag1, tag2");
  });
});
