import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ShowcaseFormStickyNavigationItem } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/stickyNav/ShowcaseFormNavigationItem";

describe("ShowcaseFormStickyNavigationItem", () => {
  it("renders the step name correctly", () => {
    render(
      <ShowcaseFormStickyNavigationItem
        stepName="Step 1"
        stepContainerId="step-1"
        isActive={false}
      />,
    );

    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });

  it("sets the correct href attribute", () => {
    render(
      <ShowcaseFormStickyNavigationItem
        stepName="Step 1"
        stepContainerId="step-1"
        isActive={false}
      />,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "#step-1");
  });

  it("applies the active class when isActive is true", () => {
    render(
      <ShowcaseFormStickyNavigationItem
        stepName="Step 1"
        stepContainerId="step-1"
        isActive={true}
      />,
    );

    const listItem = screen.getByRole("listitem");
    expect(listItem).toHaveClass("active");
  });

  it("does not apply the active class when isActive is false", () => {
    render(
      <ShowcaseFormStickyNavigationItem
        stepName="Step 1"
        stepContainerId="step-1"
        isActive={false}
      />,
    );

    const listItem = screen.getByRole("listitem");
    expect(listItem).not.toHaveClass("active");
  });

  it("renders the screen reader text when isActive is true", () => {
    render(
      <ShowcaseFormStickyNavigationItem
        stepName="Step 1"
        stepContainerId="step-1"
        isActive={true}
      />,
    );

    screen.getByText(/abschnitt aktiv/i);
  });

  it("does not render the screen reader text when isActive is false", () => {
    render(
      <ShowcaseFormStickyNavigationItem
        stepName="Step 1"
        stepContainerId="step-1"
        isActive={false}
      />,
    );

    expect(screen.queryByText("Active step")).not.toBeInTheDocument();
  });

  it("handles click event correctly", async () => {
    const mockScrollIntoView = vi.fn();
    const mockStepName = "Test Step";
    const mockStepContainerId = "test-step";
    const mockIsActive = false;
    const user = userEvent.setup();

    // Mock the target element and its scrollIntoView method
    const mockTargetElement = document.createElement("div");
    mockTargetElement.scrollIntoView = mockScrollIntoView;
    document.getElementById = vi.fn().mockReturnValue(mockTargetElement);

    render(
      <ShowcaseFormStickyNavigationItem
        stepName={mockStepName}
        stepContainerId={mockStepContainerId}
        isActive={mockIsActive}
      />,
    );

    const link = screen.getByRole("link", { name: mockStepName });
    await user.click(link);

    expect(document.getElementById).toHaveBeenCalledWith(mockStepContainerId);
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });
});
