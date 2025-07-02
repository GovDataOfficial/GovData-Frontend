import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { getCroppedImg } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/cropUtils";
import { ShowcaseFormImageCrop } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/ShowcaseFormImageCrop";
import { SHOWCASE_FORM_INPUTS } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/showcase-formConstants";

// Mock dependencies
vi.mock("react-easy-crop", () => ({
  default: vi.fn(({ onCropComplete, onCropChange, onZoomChange, image }) => {
    // Simple mock implementation to test callbacks
    const mockCropArea = { x: 10, y: 10, width: 100, height: 100 };

    // Simulate the crop complete callback being triggered
    setTimeout(() => {
      onCropComplete({}, mockCropArea);
    }, 0);

    return (
      <div data-testid="mock-cropper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="crop preview" data-testid="cropper-image" />
        <button
          data-testid="crop-change-trigger"
          onClick={() => onCropChange({ x: 20, y: 20 })}
        >
          Change Crop
        </button>
        <button
          data-testid="zoom-change-trigger"
          onClick={() => onZoomChange(2)}
        >
          Change Zoom
        </button>
      </div>
    );
  }),
}));

vi.mock(
  "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/cropUtils",
  () => ({
    getCroppedImg: vi
      .fn()
      .mockResolvedValue("data:image/png;base64,croppedImageMock"),
  }),
);

vi.mock("@/app/_components/SVG/SVG", () => ({
  icons: { remove: "remove-icon" },
  SVG: vi.fn(() => <span data-testid="svg-icon" />),
}));

vi.mock("@/app/_components/InfoBoxes/InfoBox", () => ({
  InfoBox: vi.fn(({ variant, title, className }) => (
    <div data-testid="info-box" className={className} data-variant={variant}>
      {title}
    </div>
  )),
}));

describe("ShowcaseFormImageCrop", () => {
  const mockImageSrc = "data:image/png;base64,testImageData";
  const mockOnDeleteImage = vi.fn();
  const mockImageOrderNumber = 1;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock Image object
    global.Image = class {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      src: string = "";
      naturalWidth: number = 300;
      naturalHeight: number = 300;

      constructor() {
        setTimeout(() => {
          this.onload();
        }, 0);
      }
    } as unknown as typeof Image;
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean up at the end of all tests
    consoleErrorSpy.mockRestore();
  });

  it("renders the component with correct props", async () => {
    const { container } = render(
      <ShowcaseFormImageCrop
        imageSrc={mockImageSrc}
        onDeleteImage={mockOnDeleteImage}
        imageOrderNumber={mockImageOrderNumber}
      />,
    );

    // Verify the main elements are rendered
    expect(screen.getByTestId("mock-cropper")).toBeInTheDocument();
    expect(screen.getByTestId("cropper-image")).toHaveAttribute(
      "src",
      mockImageSrc,
    );

    // Check for the zoom slider
    const zoomSlider = screen.getByRole("slider");
    expect(zoomSlider).toBeInTheDocument();
    expect(zoomSlider).toHaveAttribute("min", "1");
    expect(zoomSlider).toHaveAttribute("max", "3");
    expect(zoomSlider).toHaveAttribute("value", "1"); // Default zoom

    // Check for the hidden input with correct name
    const hiddenInput = container.querySelector(
      `input[name="${SHOWCASE_FORM_INPUTS.IMAGE}${mockImageOrderNumber}"]`,
    );
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveAttribute(
      "name",
      `${SHOWCASE_FORM_INPUTS.IMAGE}${mockImageOrderNumber}`,
    );

    // Check for the delete button
    expect(
      screen.getByRole("button", {
        name: /Bild löschen/i,
      }),
    ).toBeInTheDocument();

    // Error box should not be displayed by default
    expect(screen.queryByTestId("info-box")).not.toBeInTheDocument();
  });

  it("calls getCroppedImg on initial load", async () => {
    render(
      <ShowcaseFormImageCrop
        imageSrc={mockImageSrc}
        onDeleteImage={mockOnDeleteImage}
        imageOrderNumber={mockImageOrderNumber}
      />,
    );

    // Wait for the async operations to complete
    await waitFor(() => {
      // getCroppedImg should be called with default crop area
      expect(getCroppedImg).toHaveBeenCalledWith(
        mockImageSrc,
        expect.objectContaining({
          x: expect.any(Number),
          y: expect.any(Number),
          width: expect.any(Number),
          height: expect.any(Number),
        }),
      );
    });
  });

  it("updates hidden input with cropped image data", async () => {
    const { container } = render(
      <ShowcaseFormImageCrop
        imageSrc={mockImageSrc}
        onDeleteImage={mockOnDeleteImage}
        imageOrderNumber={mockImageOrderNumber}
      />,
    );

    // Wait for the cropping operation to complete
    await waitFor(() => {
      const hiddenInput = container.querySelector(
        `input[name="${SHOWCASE_FORM_INPUTS.IMAGE}${mockImageOrderNumber}"]`,
      );
      expect(hiddenInput).toHaveValue("data:image/png;base64,croppedImageMock");
    });
  });

  it("calls onDeleteImage when delete button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ShowcaseFormImageCrop
        imageSrc={mockImageSrc}
        onDeleteImage={mockOnDeleteImage}
        imageOrderNumber={mockImageOrderNumber}
      />,
    );

    const deleteButton = screen.getByRole("button", {
      name: /Bild löschen/i,
    });

    // Click the delete button
    await user.click(deleteButton);

    // Check that onDeleteImage was called
    expect(mockOnDeleteImage).toHaveBeenCalledTimes(1);
  });

  it("calls getCroppedImg when crop area changes", async () => {
    const user = userEvent.setup();

    render(
      <ShowcaseFormImageCrop
        imageSrc={mockImageSrc}
        onDeleteImage={mockOnDeleteImage}
        imageOrderNumber={mockImageOrderNumber}
      />,
    );

    // Clear previous calls from initial load
    vi.mocked(getCroppedImg).mockClear();

    // Trigger crop change via our mock button
    const cropChangeButton = screen.getByTestId("crop-change-trigger");
    await user.click(cropChangeButton);

    // Wait for the crop operation to complete
    await waitFor(() => {
      expect(getCroppedImg).toHaveBeenCalledWith(
        mockImageSrc,
        expect.objectContaining({
          x: 10,
          y: 10,
          width: 100,
          height: 100,
        }),
      );
    });
  });

  it("handles errors during image cropping and shows error message", async () => {
    // Make getCroppedImg reject
    const mockError = new Error("Crop failed");
    vi.mocked(getCroppedImg).mockRejectedValue(mockError);

    render(
      <ShowcaseFormImageCrop
        imageSrc={mockImageSrc}
        onDeleteImage={mockOnDeleteImage}
        imageOrderNumber={mockImageOrderNumber}
      />,
    );

    // Wait for the error to be logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
      // Error message should be displayed
      expect(
        screen.getByText(
          /Beim Zuschneiden des Bildes ist ein Fehler aufgetreten/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it("handles errors during initial image loading", async () => {
    // Mock console.error
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Override the Image mock to trigger onerror instead of onload
    global.Image = class {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      src: string = "";
      naturalWidth: number = 300;
      naturalHeight: number = 300;

      constructor() {
        setTimeout(() => {
          this.onerror();
        }, 0);
      }
    } as unknown as typeof Image;

    render(
      <ShowcaseFormImageCrop
        imageSrc={mockImageSrc}
        onDeleteImage={mockOnDeleteImage}
        imageOrderNumber={mockImageOrderNumber}
      />,
    );

    // Wait for the error to be logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to load image for initial cropping",
      );
      // Error message should be displayed
      expect(screen.getByTestId("info-box")).toBeInTheDocument();
      expect(screen.getByTestId("info-box")).toHaveAttribute(
        "data-variant",
        "error",
      );
    });

    // Clean up
    consoleErrorSpy.mockRestore();
  });

  it("resets error state when cropping is successful", async () => {
    // Mock console.error to prevent error output
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // First calls will fail - force the component into error state
    vi.mocked(getCroppedImg).mockRejectedValue(new Error("Crop failed"));

    const user = userEvent.setup();
    render(
      <ShowcaseFormImageCrop
        imageSrc={mockImageSrc}
        onDeleteImage={mockOnDeleteImage}
        imageOrderNumber={mockImageOrderNumber}
      />,
    );

    // Wait for error state
    await waitFor(() => {
      expect(
        screen.getByText(
          /Beim Zuschneiden des Bildes ist ein Fehler aufgetreten/i,
        ),
      ).toBeInTheDocument();
    });

    // Now change the mock to succeed on next call
    vi.mocked(getCroppedImg).mockReset();
    vi.mocked(getCroppedImg).mockResolvedValue(
      "data:image/png;base64,successImage",
    );

    // Trigger a new crop
    const cropChangeButton = screen.getByTestId("crop-change-trigger");
    await user.click(cropChangeButton);

    // Wait for error message to disappear
    await waitFor(
      () => {
        expect(
          screen.queryByText(
            /Beim Zuschneiden des Bildes ist ein Fehler aufgetreten/i,
          ),
        ).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    ); // Increase timeout to give more time for state to update

    // Clean up
    consoleErrorSpy.mockRestore();
  });

  it("prevents default and stops propagation on delete button click", async () => {
    const user = userEvent.setup();

    // Create mock event with spy methods
    const preventDefaultSpy = vi.fn();
    const stopPropagationSpy = vi.fn();

    render(
      <ShowcaseFormImageCrop
        imageSrc={mockImageSrc}
        onDeleteImage={mockOnDeleteImage}
        imageOrderNumber={mockImageOrderNumber}
      />,
    );

    // Get the delete button
    const deleteButton = screen.getByRole("button", {
      name: /Bild löschen/i,
    });

    // Save original methods
    const originalPreventDefault = Event.prototype.preventDefault;
    const originalStopPropagation = Event.prototype.stopPropagation;

    // Mock methods on Event prototype
    Event.prototype.preventDefault = preventDefaultSpy;
    Event.prototype.stopPropagation = stopPropagationSpy;

    try {
      // Click the delete button
      await user.click(deleteButton);

      // Check that both methods were called
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
    } finally {
      // Restore original methods
      Event.prototype.preventDefault = originalPreventDefault;
      Event.prototype.stopPropagation = originalStopPropagation;
    }
  });
});
