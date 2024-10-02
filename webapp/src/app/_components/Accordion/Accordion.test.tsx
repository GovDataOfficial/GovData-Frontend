import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { Accordion } from "@/app/_components/Accordion/Accordion";
import userEvent from "@testing-library/user-event";

describe("Accordion", () => {
  it("should render correct.", () => {
    const { getByRole } = render(<Accordion title="test">content</Accordion>);

    const detail = getByRole("group");
    screen.getByText(/content/i);

    expect(detail).toHaveTextContent("test");
    expect(detail).toHaveTextContent("content");
    expect(detail).not.toHaveAttribute("open");
  });

  it("should render correct open state.", async () => {
    const user = userEvent.setup();

    const { getByRole, container } = render(
      <Accordion title="test">content</Accordion>,
    );

    const detail = getByRole("group");
    const summary = container.querySelector("summary");

    expect(summary).toBeDefined();

    await act(() => user.click(summary!));

    expect(detail).toHaveTextContent("test");
    expect(detail).toHaveTextContent("content");
    expect(detail).toHaveAttribute("open");
  });
});
