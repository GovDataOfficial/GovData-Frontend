import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Accordion } from "@/app/_components/Accordion/Accordion";

describe("Accordion", () => {
  it("should render correct.", () => {
    render(<Accordion title="test">content</Accordion>);

    const detail = screen.getByRole("group");
    screen.getByText(/content/i);

    expect(detail).toHaveTextContent("test");
    expect(detail).toHaveTextContent("content");
    expect(detail).not.toHaveAttribute("open");
  });

  it("should render correct open state.", async () => {
    const user = userEvent.setup();

    render(<Accordion title="test">content</Accordion>);

    const detail = screen.getByRole("group");
    const summary = screen.getByText("test");

    await user.click(summary);

    expect(detail).toHaveTextContent("test");
    expect(detail).toHaveTextContent("content");
    expect(detail).toHaveAttribute("open");
  });

  it("should render initially open", () => {
    render(
      <Accordion open title="test">
        content
      </Accordion>,
    );
    const detail = screen.getByRole("group");
    expect(detail).toHaveAttribute("open");
  });

  it("should render summary with an heading element", () => {
    render(<Accordion title={<h3>test</h3>}>content</Accordion>);
    screen.getByRole("heading", { level: 3, name: "test" });
  });

  it("should render summary with an span element", () => {
    render(<Accordion title={<span>test</span>}>content</Accordion>);
    const heading = screen.queryByRole("heading", { level: 3, name: "test" });
    expect(heading).not.toBeInTheDocument();

    const summary = screen.getByText("test");
    expect(summary).toBeInstanceOf(HTMLSpanElement);
  });

  it("should render default with the filter variant", () => {
    const { container } = render(<Accordion title="test">content</Accordion>);
    const summary = container.querySelector("summary");
    expect(summary).toHaveClass("gd-accordion-head gd-accordion-head-filter");
  });

  it("should render the link variant", () => {
    const { container } = render(
      <Accordion variant="link" title="test">
        content
      </Accordion>,
    );
    const summary = container.querySelector("summary");
    expect(summary).toHaveClass("gd-accordion-head gd-accordion-head-link");
  });
});
