import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetadataFormBottomNavigation } from "@/app/datenpflege/metadaten/form/partials/MetadataFormBottomNavigation";
import userEvent from "@testing-library/user-event";

describe("MetadataFormBottomNavigation", () => {
  const getCancelLink = () => screen.queryByRole("link", { name: "Abbrechen" });
  const getBackButton = () => screen.queryByRole("button", { name: "Zurück" });
  const getForwardButton = () =>
    screen.queryByRole("button", { name: "Weiter" });
  const getToSummaryButton = () =>
    screen.queryByRole("button", { name: "Weiter zur Zusammenfassung" });

  const getSubmitButton = () =>
    screen.queryByRole("button", { name: "Metadatensatz übermitteln" });

  test("should render correct buttons for first step", () => {
    const mockSetCurrentStep = vi.fn();
    render(
      <MetadataFormBottomNavigation
        reportValidity={() => true}
        setCurrentStep={mockSetCurrentStep}
        currentStep={0}
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
      />,
    );
    await user.click(getForwardButton()!);
    expect(mockSetCurrentStep).not.toHaveBeenCalled();
  });
});
