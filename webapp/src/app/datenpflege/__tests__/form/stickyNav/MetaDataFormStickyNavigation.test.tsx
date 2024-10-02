import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MetadataFormStickyNavigation } from "@/app/datenpflege/metadaten/form/stickyNav/MetadataFormStickyNavigation";
import { METADATA_FORM_ID } from "@/app/datenpflege/metadaten/form/formConstants";

describe("MetaDataForm Sticky Navigation", () => {
  const mockSetCurrentStep = vi.fn();
  const mockCheckValdityOfStep = vi.fn();

  const mobileClass = "mobile";
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("should have correct markup and number of list items", () => {
    render(
      <MetadataFormStickyNavigation
        currentStep={0}
        setCurrentStep={mockSetCurrentStep}
        checkValidityOfStep={mockCheckValdityOfStep}
      />,
    );

    const navigation = screen.getByRole("navigation");
    expect(navigation).toHaveAttribute("aria-label", "Formular Abschnitte");
    expect(navigation).toHaveClass("metadata-sticky-form-navigation");
    expect(navigation).not.toHaveClass(mobileClass);

    const ul = within(navigation).getByRole("list");
    const listItems = within(ul).getAllByRole("listitem");

    expect(listItems).toHaveLength(8);
    expect(listItems[0]).toHaveTextContent("Datenbereitsteller");
    expect(listItems[1]).toHaveTextContent("Angaben zum Inhalt");
    expect(listItems[2]).toHaveTextContent("Kontakte");
    expect(listItems[3]).toHaveTextContent("Abdeckung und Raumbezug");
    expect(listItems[4]).toHaveTextContent("Zeitangaben");
    expect(listItems[5]).toHaveTextContent("Ressourcen");
    expect(listItems[6]).toHaveTextContent("Weitere Angaben");
    expect(listItems[7]).toHaveTextContent("Zusammenfassung");
  });

  test("should render list items as buttons when current step changes", () => {
    const { rerender } = render(
      <MetadataFormStickyNavigation
        currentStep={0}
        setCurrentStep={mockSetCurrentStep}
        checkValidityOfStep={mockCheckValdityOfStep}
      />,
    );
    const ul = screen.getByRole("list");

    expect(within(ul).getAllByRole("button")).toHaveLength(1);

    rerender(
      <MetadataFormStickyNavigation
        currentStep={1}
        setCurrentStep={mockSetCurrentStep}
        checkValidityOfStep={mockCheckValdityOfStep}
      />,
    );

    expect(within(ul).getAllByRole("button")).toHaveLength(2);

    rerender(
      <MetadataFormStickyNavigation
        currentStep={2}
        setCurrentStep={mockSetCurrentStep}
        checkValidityOfStep={mockCheckValdityOfStep}
      />,
    );

    expect(within(ul).getAllByRole("button")).toHaveLength(3);
  });

  test("should set aria-controls attribute on buttons", () => {
    render(
      <MetadataFormStickyNavigation
        currentStep={2}
        setCurrentStep={mockSetCurrentStep}
        checkValidityOfStep={mockCheckValdityOfStep}
      />,
    );

    const button = screen.getByRole("button", {
      name: "Kontakte Abschnitt aktiv",
    });
    expect(button).toHaveAttribute(
      "aria-controls",
      "metadata-form-step-container-2",
    );
  });

  test("should set correct aria-controls attribute on last summary button", () => {
    render(
      <MetadataFormStickyNavigation
        currentStep={7}
        setCurrentStep={mockSetCurrentStep}
        checkValidityOfStep={mockCheckValdityOfStep}
      />,
    );

    const button = screen.getByRole("button", {
      name: "Zusammenfassung Abschnitt aktiv",
    });
    expect(button).toHaveAttribute("aria-controls", METADATA_FORM_ID);
  });

  test("mobile version should have correct class", () => {
    render(
      <MetadataFormStickyNavigation
        currentStep={0}
        setCurrentStep={mockSetCurrentStep}
        checkValidityOfStep={mockCheckValdityOfStep}
        mobile
      />,
    );
    const navigation = screen.getByRole("navigation");
    expect(navigation).toHaveClass("metadata-sticky-form-navigation");
    expect(navigation).toHaveClass(mobileClass);
  });

  test("should show alert if a step does not validate", () => {
    const { rerender } = render(
      <MetadataFormStickyNavigation
        currentStep={1}
        setCurrentStep={mockSetCurrentStep}
        checkValidityOfStep={() => true}
      />,
    );
    // simulate switching step by rerendering,
    // e.g going from step 2 -> 1 and validating with false
    rerender(
      <MetadataFormStickyNavigation
        currentStep={0}
        setCurrentStep={mockSetCurrentStep}
        checkValidityOfStep={() => false}
      />,
    );

    const listItems = screen.getAllByRole("listitem");
    // step 2 should have alert
    expect(within(listItems[1]).getByRole("alert")).toBeVisible();
  });
});
