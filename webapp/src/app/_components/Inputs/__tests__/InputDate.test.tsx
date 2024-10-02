import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { InputDate } from "@/app/_components/Inputs/InputDate";

describe("InputDate", () => {
  it("should render correct date input", async () => {
    render(<InputDate label="MyText" name="test" />);
    screen.getByText("MyText");
    const input = screen.getByLabelText(/mytext/i);
    expect(input).toHaveAttribute("type", "date");
    expect(input).toHaveAttribute("name", "test");
  });

  it("should set input to required", async () => {
    render(<InputDate label="MyText" name="test" required />);

    const input = screen.getByLabelText(/mytext/i);
    expect(input).toHaveAttribute("required");
    screen.getByText(/\*/i);
  });

  it("should show input as recommended", () => {
    render(<InputDate label="MyText" name="test" recommended />);

    const input = screen.getByLabelText(/mytext \(empfohlen\)/i);
    expect(input).toHaveAttribute("data-recommended");
  });
});
