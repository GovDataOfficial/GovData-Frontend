import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { InputText } from "@/app/_components/Inputs/InputText";
import { InputCheckbox } from "@/app/_components/Inputs/InputCheckbox";

describe("InputCheckbox", () => {
  it("should render correct text input", async () => {
    render(<InputCheckbox label="MyText" name="test" />);
    screen.getByText("MyText");
    const input = screen.getByRole("checkbox", { name: "MyText" });
    expect(input).toHaveAttribute("type", "checkbox");
    expect(input).toHaveAttribute("name", "test");
  });

  it("should set extra class as checkbox requires more styling", () => {
    const { container } = render(<InputCheckbox label="MyText" name="test" />);

    expect(
      container.querySelector(".gd-input.gd-input-checkbox"),
    ).toBeInTheDocument();
  });
});
