import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MetadataFormBottomNavigation } from "@/app/datenpflege/_components/MetadataForm/partials/MetadataFormBottomNavigation";

describe("MetadataFormBottomNavigation", () => {
  const getCancelLink = () => screen.queryByRole("link", { name: "Abbrechen" });
  const getBackButton = () => screen.queryByRole("button", { name: "Zurück" });
  const getForwardButton = () =>
    screen.queryByRole("button", { name: "Weiter" });
  const getToSummaryButton = () =>
    screen.queryByRole("button", { name: "Weiter zur Zusammenfassung" });

  const getSubmitButton = () =>
    screen.queryByRole("button", { name: "speichern" });

  test("should render correct buttons for first step", () => {
    const mockSetCurrentStep = vi.fn();
    render(
      <MetadataFormBottomNavigation
        reportValidity={() => true}
        setCurrentStep={mockSetCurrentStep}
        currentStep={0}
        submitButtonTitle={"speichern"}
      />,
    );

    expect(getCancelLink()).toBeVisible();
    expect(getBackButton()).toBeNull();
    expect(getForwardButton()).toBeVisible();
    expect(getToSummaryButton()).toBeNull();
    expect(getSubmitButton()).toBeNull();
  });

  test("should render correct buttons a middle step", () => {
    const mockSetCurrentStep = vi.fn();
    render(
      <MetadataFormBottomNavigation
        reportValidity={() => true}
        setCurrentStep={mockSetCurrentStep}
        currentStep={3}
        submitButtonTitle={"speichern"}
      />,
    );

    expect(getCancelLink()).toBeVisible();
    expect(getBackButton()).toBeVisible();
    expect(getForwardButton()).toBeVisible();
    expect(getToSummaryButton()).toBeNull();
    expect(getSubmitButton()).toBeNull();
  });

  test("should render correct buttons step before summary", () => {
    const mockSetCurrentStep = vi.fn();
    render(
      <MetadataFormBottomNavigation
        reportValidity={() => true}
        setCurrentStep={mockSetCurrentStep}
        currentStep={6}
        submitButtonTitle={"speichern"}
      />,
    );

    expect(getCancelLink()).toBeVisible();
    expect(getBackButton()).toBeVisible();
    expect(getForwardButton()).toBeNull();
    expect(getToSummaryButton()).toBeVisible();
    expect(getSubmitButton()).toBeNull();
  });

  test("should render correct buttons for last step", () => {
    const mockSetCurrentStep = vi.fn();
    render(
      <MetadataFormBottomNavigation
        reportValidity={() => true}
        setCurrentStep={mockSetCurrentStep}
        currentStep={7}
        submitButtonTitle={"speichern"}
      />,
    );

    expect(getCancelLink()).toBeVisible();
    expect(getBackButton()).toBeVisible();
    expect(getForwardButton()).toBeNull();
    expect(getToSummaryButton()).toBeNull();
    expect(getSubmitButton()).toBeVisible();
  });

  test("should call setCurrentstep if reportvalidity returns true", async () => {
    const mockSetCurrentStep = vi.fn();
    const user = userEvent.setup();
    render(
      <MetadataFormBottomNavigation
        reportValidity={() => true}
        setCurrentStep={mockSetCurrentStep}
        currentStep={2}
        submitButtonTitle={"speichern"}
      />,
    );
    await user.click(getForwardButton()!);
    expect(mockSetCurrentStep).toHaveBeenCalled();
  });

  test("should not call setCurrentstep if reportvalidity returns false", async () => {
    const mockSetCurrentStep = vi.fn();
    const user = userEvent.setup();
    render(
      <MetadataFormBottomNavigation
        reportValidity={() => false}
        setCurrentStep={mockSetCurrentStep}
        currentStep={2}
        submitButtonTitle={"speichern"}
      />,
    );
    await user.click(getForwardButton()!);
    expect(mockSetCurrentStep).not.toHaveBeenCalled();
  });

  test("should render correct ids for buttons required for system tests", async () => {
    const props = {
      reportValidity: () => false,
      setCurrentStep: vi.fn(),
      submitButtonTitle: "speichern",
    };

    const { rerender } = render(
      <MetadataFormBottomNavigation {...props} currentStep={5} />,
    );

    const forward = getForwardButton();
    expect(forward).toHaveAttribute("id", "metadata-form-continue-button");
    const back = getBackButton();
    expect(back).toHaveAttribute("id", "metadata-form-back-button");

    rerender(<MetadataFormBottomNavigation {...props} currentStep={7} />);

    const submit = getSubmitButton();
    expect(submit).toHaveAttribute("id", "metadata-form-submit-button");
  });
});
