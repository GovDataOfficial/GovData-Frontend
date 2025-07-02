import { describe, expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";

import {
  SHOWCASE_FORM_INPUTS,
  SHOWCASE_FORM_MAX_LENGTH_LONG,
  SHOWCASE_FORM_MAX_LENGTH_SMALL,
} from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/showcase-formConstants";
import { ShowcaseFormStepContents } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/steps/ShowcaseFormStepContents";

const testCategories = [
  {
    name: "soci",
    displayName: "Bevölkerung und Gesellschaft",
    title: "Bevölkerung und Gesellschaft",
    count: 29,
    type: "group" as const,
  },
  {
    name: "educ",
    displayName: "Bildung, Kultur und Sport",
    title: "Bildung, Kultur und Sport",
    count: 44,
    type: "group" as const,
  },
  {
    name: "ener",
    displayName: "Energie",
    title: "Energie",
    count: 0,
    type: "group" as const,
  },
];

describe("ShowcaseFormStepContents", () => {
  const getTitle = () => screen.getByRole("textbox", { name: /titel/i });

  const getNotes = () => screen.getByRole("textbox", { name: /beschreibung/i });
  const getSpatial = () => screen.getByRole("textbox", { name: /raumbezug/i });

  const getKeywords = () =>
    screen.getByRole("textbox", { name: /schlagwörter/i });
  const getCategories = () =>
    screen.getByRole("group", { name: "Kategorien (empfohlen)" });
  const getPlatforms = () => screen.getByRole("group", { name: "Systeme" });
  const getShowcaseTypes = () =>
    screen.getByRole("group", { name: "Anwendungstypen" });

  const getCreatedDate = () => screen.getByLabelText(/erstellungsdatum/i);
  const getModifiedDate = () => screen.getByLabelText(/aktualisierungsdatum/i);

  test("should render correct headline", () => {
    render(<ShowcaseFormStepContents categories={testCategories} />);
    screen.getByRole("heading", { name: "Angaben zum Inhalt", level: 2 });
  });

  test("should render correct inputs markup", () => {
    render(<ShowcaseFormStepContents categories={testCategories} />);

    const title = getTitle();
    expect(title).toHaveAttribute("name", SHOWCASE_FORM_INPUTS.TITLE);
    expect(title).toHaveDisplayValue("");
    expect(title).toHaveAttribute(
      "maxlength",
      SHOWCASE_FORM_MAX_LENGTH_SMALL.toString(),
    );

    const notes = getNotes();
    expect(notes).toHaveAttribute("name", SHOWCASE_FORM_INPUTS.NOTES);
    expect(notes).toHaveAttribute(
      "maxlength",
      SHOWCASE_FORM_MAX_LENGTH_LONG.toString(),
    );
    expect(notes).toHaveDisplayValue("");

    const keywords = getKeywords();
    expect(keywords).toHaveAttribute("name", SHOWCASE_FORM_INPUTS.KEYWORDS);
    expect(keywords).toHaveDisplayValue("");
    expect(keywords).toHaveAttribute(
      "maxlength",
      SHOWCASE_FORM_MAX_LENGTH_LONG.toString(),
    );

    getCategories();
    getPlatforms();
    getShowcaseTypes();

    const createdDate = getCreatedDate();
    expect(createdDate).toHaveAttribute(
      "name",
      SHOWCASE_FORM_INPUTS.CREATED_DATE,
    );
    expect(createdDate).not.toBeRequired();

    const modifiedDate = getModifiedDate();
    expect(modifiedDate).toHaveAttribute(
      "name",
      SHOWCASE_FORM_INPUTS.MODIFIED_DATE,
    );
    expect(modifiedDate).not.toBeRequired();

    const spatial = getSpatial();
    expect(spatial).toHaveAttribute("name", SHOWCASE_FORM_INPUTS.SPATIAL);
    expect(spatial).toHaveAttribute(
      "maxlength",
      SHOWCASE_FORM_MAX_LENGTH_LONG.toString(),
    );
    expect(spatial).toHaveDisplayValue("");
  });

  test("should render inputs with prefilled data", () => {
    const defaultData = {
      defaultTitle: "testtitle",
      defaultNotes: "test-notes",
      defaultKeywords: ["tag1", "tag2"],
      defaultShowcaseTypes: ["website", "visualization", "mobile_app"],
      defaultPlatforms: ["android", "ios"],
      defaultCategories: ["ener", "soci"],
      defaultManualShowcaseCreatedDate: 1622505600000,
      defaultManualShowcaseModifiedDate: 1622937600000,
      defaultSpatial: "test-spatial",
    };

    render(
      <ShowcaseFormStepContents categories={testCategories} {...defaultData} />,
    );

    expect(getTitle()).toHaveDisplayValue(defaultData.defaultTitle);
    expect(getNotes()).toHaveDisplayValue(defaultData.defaultNotes);
    expect(getSpatial()).toHaveDisplayValue(defaultData.defaultSpatial);
    expect(getKeywords()).toHaveDisplayValue("tag1, tag2");

    const categoriesGroup = getCategories();
    ["Energie", "Bevölkerung und Gesellschaft"].forEach((label) => {
      const checkbox = within(categoriesGroup).getByLabelText(label);
      expect(checkbox).toBeChecked();
    });

    const platformGroup = getPlatforms();
    ["Android", "iOS"].forEach((label) => {
      const checkbox = within(platformGroup).getByLabelText(label);
      expect(checkbox).toBeChecked();
    });

    const showcaseTypesGroup = getShowcaseTypes();
    ["Webseite", "Visualisierung", "Mobile App"].forEach((label) => {
      const checkbox = within(showcaseTypesGroup).getByLabelText(label);
      expect(checkbox).toBeChecked();
    });

    expect(getCreatedDate()).toHaveDisplayValue("2021-06-01");
    expect(getModifiedDate()).toHaveDisplayValue("2021-06-06");
  });
});
