import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useTooltip } from "../hooks/useTooltip";

function TooltipComponent({ title }: { title: string }) {
  const ref = useTooltip<HTMLButtonElement>();
  return (
    <>
      <button ref={ref} title={title}>
        Hover over me
      </button>
    </>
  );
}

describe("useTooltip", () => {
  it("should toggle tooltip on hover and unhover", async () => {
    const user = userEvent.setup();
    render(<TooltipComponent title="Test Tooltip" />);

    // component with tooltip ref
    const element = screen.getByText("Hover over me");
    expect(element).toBeVisible();

    // element has title and no tooltip is shown
    expect(element).toHaveAttribute("title", "Test Tooltip");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    // hover over element to trigger tooltip
    await user.hover(element);

    // element has no title to avoid showing default browser tooltip
    expect(element).not.toHaveAttribute("title", "Test Tooltip");

    // tooltip is now visible with contents of title attribute
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeVisible();
    expect(tooltip).toHaveTextContent("Test Tooltip");

    // hover away from element to hide tooltip
    await user.unhover(element);

    // element should have title again
    await waitFor(() =>
      expect(element).toHaveAttribute("title", "Test Tooltip"),
    );

    // tooltip not visible anymore
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("should update the tooltip content when the title attribute changes", async () => {
    const user = userEvent.setup();

    const { rerender } = render(<TooltipComponent title="Initial Tooltip" />);
    const element = screen.getByText("Hover over me");

    // hover over element to trigger tooltip
    await user.hover(element);
    // element title should have been removed
    expect(element).not.toHaveAttribute("title");

    // tooltip is shown with initial content
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeVisible();
    expect(tooltip).toHaveTextContent("Initial Tooltip");

    // rerender component with new title
    rerender(<TooltipComponent title="Updated Tooltip" />);
    // tooltip still must be visible with new content
    expect(tooltip).toBeVisible();
    expect(tooltip).toHaveTextContent("Updated Tooltip");

    // element should still have no title attributes
    await waitFor(() => expect(element).not.toHaveAttribute("title"));
  });
});
