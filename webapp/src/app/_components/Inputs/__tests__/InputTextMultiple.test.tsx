import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { InputTextMultiple } from "@/app/_components/Inputs/InputTextMultiple";
import userEvent from "@testing-library/user-event";

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
      /ein wert oder mehrere werte erlaubt\. mehrere werte mit komma getrennt angeben:/i,
    );

    screen.getByText(/abc, def/i);
  });

  it("should render hidden inputs for each string split by ,", async () => {
    const user = userEvent.setup();
    render(<InputTextMultiple label="MyText" name="test" />);
    const input = screen.getByRole("textbox", { name: "MyText" });

    await user.type(input, "nummer2, noch eins, und weiter");

    const hiddenInputs = await screen.findAllByRole("textbox", {
      hidden: true,
    });

    // 4, first one is the visible we used, other 3 hidden
    expect(hiddenInputs).toHaveLength(4);

    expect(hiddenInputs[1]).toHaveAttribute("hidden");
    expect(hiddenInputs[1]).toHaveAttribute("name", "test");
    expect(hiddenInputs[1]).toHaveValue("nummer2");
    expect(hiddenInputs[2]).toHaveAttribute("hidden");
    expect(hiddenInputs[2]).toHaveAttribute("name", "test");
    expect(hiddenInputs[2]).toHaveValue("noch eins");
    expect(hiddenInputs[3]).toHaveAttribute("hidden");
    expect(hiddenInputs[3]).toHaveAttribute("name", "test");
    expect(hiddenInputs[3]).toHaveValue("und weiter");
  });
});
