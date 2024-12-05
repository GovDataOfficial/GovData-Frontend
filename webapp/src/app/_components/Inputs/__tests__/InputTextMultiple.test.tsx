import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { InputTextMultiple } from "@/app/_components/Inputs/InputTextMultiple";

describe("InputTextMultiple", () => {
  it("should render correct text input", async () => {
    render(<InputTextMultiple label="MyText" name="test" />);
    screen.getByText("MyText");
    const input = screen.getByRole("textbox", { name: "MyText" });
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("name", "test");
  });

  it("should set input to required", async () => {
    render(<InputTextMultiple label="MyText" name="test" required />);

    const input = screen.getByRole("textbox", { name: "MyText" });
    expect(input).toHaveAttribute("required");
    screen.getByText(/\*/i);
  });

  it("should show input as recommended", () => {
    render(<InputTextMultiple label="MyText" name="test" recommended />);

    const input = screen.getByRole("textbox", { name: "MyText (empfohlen)" });
    expect(input).toHaveAttribute("data-recommended");
  });

  it("should render information about how to use it.", () => {
    render(
      <InputTextMultiple
        label="MyText"
        name="test"
        recommended
        examples={["ABC, DEF"]}
      />,
    );
    screen.getByText(
      /ein wert oder mehrere werte erlaubt\. mehrere werte mit komma getrennt angeben./i,
    );

    screen.getByText(/abc, def/i);
  });
});
