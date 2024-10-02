import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { InputDate } from "@/app/_components/Inputs/InputDate";
import { TextArea } from "@/app/_components/Inputs/TextArea";

describe("TextArea", () => {
  it("should render correct textarea", async () => {
    render(<TextArea label="MyText" name="test" />);
    screen.getByText("MyText");
    const textarea = screen.getByRole("textbox", { name: "MyText" });
    expect(textarea).toHaveAttribute("name", "test");
  });

  it("should set textarea to required", async () => {
    render(<TextArea label="MyText" name="test" required />);

    const textarea = screen.getByRole("textbox", { name: "MyText" });
    expect(textarea).toHaveAttribute("required");
    screen.getByText(/\*/i);
  });

  it("should show textarea as recommended", () => {
    render(<TextArea label="MyText" name="test" recommended />);

    const textarea = screen.getByRole("textbox", {
      name: "MyText (empfohlen)",
    });
    expect(textarea).toHaveAttribute("data-recommended");
  });
});
