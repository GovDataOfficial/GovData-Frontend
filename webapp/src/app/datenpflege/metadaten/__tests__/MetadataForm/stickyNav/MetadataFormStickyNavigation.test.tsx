import { beforeEach, describe, expect, test, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";

import { METADATA_FORM_ID } from "@/app/datenpflege/metadaten/_components/MetadataForm/metadata-formConstants";
import { MetadataFormStickyNavigation } from "@/app/datenpflege/metadaten/_components/MetadataForm/stickNav/MetadataFormStickyNavigation";

describe("MetadataForm Sticky Navigation", () => {
  const mockSetCurrentStep = vi.fn();
  const mockCheckValdityOfStep = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("should have correct markup and number of list items", async () => {
    await act(async () => {
      render(
        <MetadataFormStickyNavigation
          currentStep={0}
          setCurrentStep={mockSetCurrentStep}
          checkValidityOfStep={mockCheckValdityOfStep}
        />,
      );
    });

    const navigation = screen.getByRole("navigation");
    expect(navigation).toHaveAttribute("aria-label", "Formular Abschnitte");
    expect(navigation).toHaveClass("sticky-form-navigation");

    const ul = within(navigation).getByRole("list");
    const listItems = within(ul).getAllByRole("listitem");

    expect(listItems).toHaveLength(8);
    expect(listItems[0]).toHaveTextContent("Datenbereitsteller");
    expect(listItems[1]).toHaveTextContent("Angaben zum Inhalt");
    expect(listItems[2]).toHaveTextContent("Kontakte");
    expect(listItems[3]).toHaveTextContent(
      "Abdeckung und Raumbezug des Metadatensatzes",
    );
    expect(listItems[4]).toHaveTextContent("Zeitangaben");
    expect(listItems[5]).toHaveTextContent("Ressourcen");
    expect(listItems[6]).toHaveTextContent("Weitere Angaben");
    expect(listItems[7]).toHaveTextContent("Zusammenfassung");
  });

  test("should render list items as buttons when current step changes", async () => {
    let rerender: ReturnType<typeof render>["rerender"];
    await act(async () => {
      ({ rerender } = render(
        <MetadataFormStickyNavigation
          currentStep={0}
          setCurrentStep={mockSetCurrentStep}
          checkValidityOfStep={mockCheckValdityOfStep}
        />,
      ));
    });
    const ul = screen.getByRole("list");

    expect(within(ul).getAllByRole("button")).toHaveLength(1);

    await act(async () => {
      rerender(
        <MetadataFormStickyNavigation
          currentStep={1}
          setCurrentStep={mockSetCurrentStep}
          checkValidityOfStep={mockCheckValdityOfStep}
        />,
      );
    });

    expect(within(ul).getAllByRole("button")).toHaveLength(2);

    await act(async () => {
      rerender(
        <MetadataFormStickyNavigation
          currentStep={2}
          setCurrentStep={mockSetCurrentStep}
          checkValidityOfStep={mockCheckValdityOfStep}
        />,
      );
    });

    expect(within(ul).getAllByRole("button")).toHaveLength(3);
  });

  test("should set aria-controls attribute on buttons", async () => {
    await act(async () => {
      render(
        <MetadataFormStickyNavigation
          currentStep={2}
          setCurrentStep={mockSetCurrentStep}
          checkValidityOfStep={mockCheckValdityOfStep}
        />,
      );
    });

    const button = screen.getByRole("button", {
      name: "Kontakte Abschnitt aktiv",
    });
    expect(button).toHaveAttribute(
      "aria-controls",
      "metadata-form-step-container-2",
    );
  });

  test("should set correct aria-controls attribute on last summary button", async () => {
    await act(async () => {
      render(
        <MetadataFormStickyNavigation
          currentStep={7}
          setCurrentStep={mockSetCurrentStep}
          checkValidityOfStep={mockCheckValdityOfStep}
        />,
      );
    });

    const button = screen.getByRole("button", {
      name: "Zusammenfassung Abschnitt aktiv",
    });
    expect(button).toHaveAttribute("aria-controls", METADATA_FORM_ID);
  });

  test("should mark all steps visited in edit mode", async () => {
    await act(async () => {
      render(
        <MetadataFormStickyNavigation
          currentStep={0}
          setCurrentStep={mockSetCurrentStep}
          checkValidityOfStep={mockCheckValdityOfStep}
          editMode
        />,
      );
    });

    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]).toHaveClass("active");
    listItems.slice(1).forEach((item) => {
      expect(item).toHaveClass("done");
      expect(item).not.toHaveClass("notvisited");
    });
  });

  test("should show alert if a step does not validate", async () => {
    let rerender: ReturnType<typeof render>["rerender"];
    await act(async () => {
      ({ rerender } = render(
        <MetadataFormStickyNavigation
          currentStep={1}
          setCurrentStep={mockSetCurrentStep}
          checkValidityOfStep={() => true}
        />,
      ));
    });
    // simulate switching step by rerendering,
    // e.g going from step 2 -> 1 and validating with false
    await act(async () => {
      rerender(
        <MetadataFormStickyNavigation
          currentStep={0}
          setCurrentStep={mockSetCurrentStep}
          checkValidityOfStep={() => false}
        />,
      );
    });

    const listItems = screen.getAllByRole("listitem");
    // step 2 should have alert
    expect(within(listItems[1]).getByRole("alert")).toBeVisible();
  });
});
