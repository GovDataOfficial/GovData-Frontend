import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { InputText } from "@/app/_components/Inputs/InputText";

describe("InputText", () => {
  it("should render correct text input", async () => {
    render(<InputText label="MyText" name="test" />);
    screen.getByText("MyText");
    const input = screen.getByRole("textbox", { name: "MyText" });
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("name", "test");
  });

  it("should set input to required", async () => {
    render(<InputText label="MyText" name="test" required />);

    const input = screen.getByRole("textbox", { name: "MyText" });
    expect(input).toHaveAttribute("required");
    screen.getByText(/\*/i);
  });

  it("should show input as recommended", () => {
    render(<InputText label="MyText" name="test" recommended />);

    const input = screen.getByRole("textbox", { name: "MyText (empfohlen)" });
    expect(input).toHaveAttribute("data-recommended");
  });
});
