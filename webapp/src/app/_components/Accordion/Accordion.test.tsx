import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

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

  it("should render the arrow icon inside the summary", () => {
    const { container } = render(<Accordion title="test">content</Accordion>);
    const icon = container.querySelector("summary .gd-icon");
    expect(icon).toBeInTheDocument();
  });

  it("should apply only the base class and never the removed rotate-arrows class", () => {
    const { container } = render(<Accordion title="test">content</Accordion>);
    const detail = container.querySelector("details");
    expect(detail).toHaveClass("gd-accordion");
    expect(detail).not.toHaveClass("gd-accordion-rotate-arrows");
    expect(detail?.className.trim()).toBe("gd-accordion");
  });

  it("should forward the ref to the details element", () => {
    const ref = createRef<HTMLDetailsElement>();
    render(
      <Accordion ref={ref} title="test">
        content
      </Accordion>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDetailsElement);
  });

  it("should toggle the open state back to closed on second click", async () => {
    const user = userEvent.setup();
    render(
      <Accordion open title="test">
        content
      </Accordion>,
    );

    const detail = screen.getByRole("group");
    const summary = screen.getByText("test");
    expect(detail).toHaveAttribute("open");

    await user.click(summary);
    expect(detail).not.toHaveAttribute("open");
  });
});
