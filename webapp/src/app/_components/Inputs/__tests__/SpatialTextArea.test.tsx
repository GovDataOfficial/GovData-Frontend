import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { valid } from "geojson-validation";

import { SpatialTextArea } from "@/app/_components/Inputs/SpatialTextArea";

// Mock the geojson-validation library
vi.mock("geojson-validation", () => ({
  valid: vi.fn(),
}));

describe("SpatialTextArea", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render correct textarea", async () => {
    render(<SpatialTextArea label="MyText" name="test" />);
    screen.getByText("MyText");
    const textarea = screen.getByRole("textbox", { name: "MyText" });
    expect(textarea).toHaveAttribute("name", "test");
  });

  it("should set textarea to required", async () => {
    render(<SpatialTextArea label="MyText" name="test" required />);

    const textarea = screen.getByRole("textbox", { name: "MyText" });
    expect(textarea).toHaveAttribute("required");
    screen.getByText(/\*/i);
  });

  it("should show textarea as recommended", () => {
    render(<SpatialTextArea label="MyText" name="test" recommended />);

    const textarea = screen.getByRole("textbox", {
      name: "MyText (empfohlen)",
    });
    expect(textarea).toHaveAttribute("data-recommended");
  });

  it("should apply custom validation with valid GeoJSON", async () => {
    vi.mocked(valid as any).mockReturnValue(true);

    render(<SpatialTextArea label="GeoJSON" name="geo" />);

    const textarea = screen.getByRole("textbox", {
      name: "GeoJSON",
    }) as HTMLTextAreaElement;

    // recommended for json input instead of userEvent.type
    fireEvent.change(textarea, {
      target: { value: '{"type":"Point","coordinates":[10,20]}' },
    });

    expect(valid).toHaveBeenCalled();
    expect(textarea.validity.valid).toBe(true);
  });

  it("should apply custom validation with invalid GeoJSON", async () => {
    vi.mocked(valid as any).mockReturnValue(false);

    render(<SpatialTextArea label="GeoJSON" name="geo" />);

    const textarea = screen.getByRole("textbox", {
      name: "GeoJSON",
    }) as HTMLTextAreaElement;

    // recommended for json input instead of userEvent.type
    fireEvent.change(textarea, {
      target: { value: '{"type":"InvalidType"}' },
    });

    expect(valid).toHaveBeenCalled();
    expect(textarea.validity.valid).toBe(false);
  });

  it("should handle invalid JSON syntax", async () => {
    render(<SpatialTextArea label="GeoJSON" name="geo" />);

    const textarea = screen.getByRole("textbox", {
      name: "GeoJSON",
    }) as HTMLTextAreaElement;

    // recommended for json input instead of userEvent.type
    fireEvent.change(textarea, {
      target: { value: '{type:"NotValidJSON"' },
    });

    expect(valid).not.toHaveBeenCalled(); // JSON.parse would fail before calling valid()
    expect(textarea.validity.valid).toBe(false);
  });

  it("should validate on initial render with defaultValue", () => {
    vi.mocked(valid as any).mockReturnValue(true);

    render(
      <SpatialTextArea
        label="GeoJSON"
        name="geo"
        defaultValue='{"type":"Point","coordinates":[1,1]}'
      />,
    );

    expect(valid).toHaveBeenCalled();
    const textarea = screen.getByRole("textbox", {
      name: "GeoJSON",
    }) as HTMLTextAreaElement;
    expect(textarea.validity.valid).toBe(true);
  });

  it("should validate on blur", async () => {
    vi.mocked(valid as any).mockReturnValue(false);
    const user = userEvent.setup();

    render(<SpatialTextArea label="GeoJSON" name="geo" />);

    const textarea = screen.getByRole("textbox", {
      name: "GeoJSON",
    }) as HTMLTextAreaElement;

    // recommended for json input instead of userEvent.type
    fireEvent.change(textarea, {
      target: { value: '{"type":"Invalid"}' },
    });
    await user.tab(); // Still use user-event for the tab

    expect(valid).toHaveBeenCalled();
    expect(textarea.validity.valid).toBe(false);
  });

  it("should handle empty input", async () => {
    const user = userEvent.setup();

    render(<SpatialTextArea label="GeoJSON" name="geo" />);

    const textarea = screen.getByRole("textbox", {
      name: "GeoJSON",
    }) as HTMLTextAreaElement;

    await act(async () => {
      // Clear the textarea
      await user.clear(textarea);
      await user.tab(); // Move focus away
    });

    expect(valid).not.toHaveBeenCalled();

    // If not required, empty should be valid
    expect(textarea.validity.valid).toBe(true);
  });

  it("should mark empty input as invalid when required", async () => {
    render(<SpatialTextArea label="GeoJSON" name="geo" required />);
    const textarea = screen.getByRole("textbox", {
      name: "GeoJSON",
    }) as HTMLTextAreaElement;

    await act(async () => {
      await userEvent.clear(textarea);
      await userEvent.tab(); // Move focus away
    });

    expect(textarea.validity.valid).toBe(false);
  });
});
