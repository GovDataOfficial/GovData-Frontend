import { describe, expect, it } from "vitest";
import { Dropdown } from "@/app/_components/Dropdown/Dropdown";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Dropdown", () => {
  const options = ["some", "new", "bla"];

  function TestComponent() {
    return (
      <Dropdown options={options} title={"drop it down"}>
        {(item) => item}
      </Dropdown>
    );
  }

  it("should render necessary a11y attributes", () => {
    render(<TestComponent />);

    const button = screen.getByRole("button", { name: "drop it down" });
    expect(button.getAttribute("aria-haspopup")).toBe("true");
    const controlId = button.getAttribute("aria-controls");

    // list hidden as we didnt open it yet
    const dropdown = screen.getByRole("list", { hidden: true });
    expect(dropdown.getAttribute("id")).toBe(controlId);
  });

  it("should expand the list on click", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    const button = screen.getByRole("button", { name: "drop it down" });

    expect(button.getAttribute("aria-expanded")).toBe("false");

    await act(() => user.click(button));
    expect(button.getAttribute("aria-expanded")).toBe("true");

    const list = await screen.findByRole("list");
    expect(list.getAttribute("aria-hidden")).toBe("false");
  });

  it.todo("test keyboard navigation/blur/escape");
});
