import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { InputText } from "@/app/_components/Inputs/InputText";
import { InputEmail } from "@/app/_components/Inputs/InputEmail";
import userEvent from "@testing-library/user-event";

describe("InputEmail", () => {
  it("should render correct email input", async () => {
    render(<InputEmail label="MyText" name="test" />);
    screen.getByText("MyText");
    const input = screen.getByRole("textbox", { name: "MyText" });
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("name", "test");
  });

  it("should set input to required", async () => {
    render(<InputEmail label="MyText" name="test" required />);

    const input = screen.getByRole("textbox", { name: "MyText" });
    expect(input).toHaveAttribute("required");
    screen.getByText(/\*/i);
  });

  it("should show input as recommended", () => {
    render(<InputEmail label="MyText" name="test" recommended />);

    const input = screen.getByRole("textbox", { name: "MyText (empfohlen)" });
    expect(input).toHaveAttribute("data-recommended");
  });

  it("should show custom validation message if input is invalid", async () => {
    const user = userEvent.setup();
    render(
      <InputEmail
        label="MyText"
        name="test"
        customValidationMessage="Das ist ein Fehler"
      />,
    );
    const input = screen.getByRole("textbox", {
      name: "MyText",
    }) as HTMLInputElement;
    await user.type(input, "blabla");
    expect(input).not.toBeValid();
    expect(input.validationMessage).toBe("Das ist ein Fehler");
  });
});
