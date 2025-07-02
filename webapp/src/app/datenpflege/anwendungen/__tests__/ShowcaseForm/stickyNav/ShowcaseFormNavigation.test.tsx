import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { generateStepContainerId } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/partials/ShowcaseFormStepContainer";
import { ShowcaseFormNavigation } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/stickyNav/ShowcaseFormNavigation";
import { useShowcaseFormStickyNavigation } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/stickyNav/useShowcaseFormStickyNavigation";

vi.mock(
  "@/app/datenpflege/anwendungen/_components/ShowcaseForm/stickyNav/useShowcaseFormStickyNavigation",
  () => ({
    useShowcaseFormStickyNavigation: vi.fn(),
  }),
);

describe("ShowcaseFormNavigation", () => {
  const mockIsActive = vi.fn();

  beforeEach(() => {
    vi.mocked(useShowcaseFormStickyNavigation).mockReturnValue({
      isActive: mockIsActive,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the navigation with the correct aria-label", () => {
    render(<ShowcaseFormNavigation />);
    expect(screen.getByLabelText(/formular abschnitte/i)).toBeInTheDocument();
  });

  it("renders all navigation items", () => {
    render(<ShowcaseFormNavigation />);
    screen.getByText(/angaben zum inhalt/i);
    screen.getByText(/links/i);
    screen.getByText(/kontakt/i);
  });

  it("calls isActive with the correct step container IDs", () => {
    render(<ShowcaseFormNavigation />);
    const items = ["contents", "links", "contact"];
    items.forEach((item) => {
      const stepContainerId = generateStepContainerId(item);
      expect(mockIsActive).toHaveBeenCalledWith(stepContainerId);
    });
  });
});
