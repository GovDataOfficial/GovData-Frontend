import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Select } from "../Select";

const options = [
  { key: "a", label: "Label A" },
  { key: "b", label: "Label B" },
  { key: "c", label: "Label C" },
];

describe("Select", () => {
  const mappedOptions = options.map((o) => (
    <option key={o.key} value={o.key}>
      {o.label}
    </option>
  ));

  it("should render correctly", async () => {
    render(
      <Select label="Hallo Welt" onChange={vi.fn()} value="a">
        {mappedOptions}
      </Select>,
    );

    screen.getByRole("option", { name: /label a/i });
    screen.getByRole("option", { name: /label b/i });
    screen.getByRole("option", { name: /label c/i });
    screen.getByLabelText("Hallo Welt");
  });

  it("should not render without options", () => {
    render(<Select label="Hallo Welt" onChange={vi.fn()} value="a" />);

    const select = screen.queryByLabelText("Hallo Welt");
    expect(select).toBeNull();
  });

  it("should render as required", () => {
    render(
      <Select label="Hallo Welt" required>
        {mappedOptions}
      </Select>,
    );
    screen.getByText(/\*/i);
    const select = screen.getByRole("combobox", { name: /hallo welt/i });
    expect(select).toHaveAttribute("required");
  });

  it("should render as recommended", () => {
    render(
      <Select label="Hallo Welt" recommended>
        {mappedOptions}
      </Select>,
    );
    screen.getByLabelText("Hallo Welt (empfohlen)");
  });

  it("should control select by value", async () => {
    const { rerender } = render(
      <Select label="Hallo Welt" onChange={vi.fn()} value="a">
        {mappedOptions}
      </Select>,
    );

    const optionA = screen.getByRole("option", {
      name: /label a/i,
    }) as HTMLOptionElement;
    expect(optionA.selected).toBe(true);

    rerender(
      <Select label="Hallo Welt" onChange={vi.fn()} value="b">
        {mappedOptions}
      </Select>,
    );
    expect(screen.getByLabelText("Hallo Welt"));
    const optionB = screen.getByRole("option", {
      name: /label b/i,
    }) as HTMLOptionElement;
    expect(optionB.selected).toBe(true);
  });
});
