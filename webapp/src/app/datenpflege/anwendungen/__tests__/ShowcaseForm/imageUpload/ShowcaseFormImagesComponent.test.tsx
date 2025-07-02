import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { ShowcaseFormImagesComponent } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/ShowcaseFormImagesComponent";

// Mock dependencies
vi.mock(
  "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/ShowcaseFormImageUploadAndCrop",
  () => ({
    ShowcaseFormImageUploadAndCrop: ({
      defaultImage,
      imageOrderNumber,
    }: {
      defaultImage?: string;
      imageOrderNumber: number;
    }) => (
      <div data-testid={`image-upload-${imageOrderNumber}`}>
        {defaultImage ? `Image: ${defaultImage}` : "No image"}
      </div>
    ),
  }),
);

describe("ShowcaseFormImagesComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly without default images", () => {
    render(<ShowcaseFormImagesComponent />);

    // Should render 4 image upload components
    const imageUploads = screen.getAllByTestId(/image-upload-\d/);
    expect(imageUploads).toHaveLength(4);

    // All should have no image
    imageUploads.forEach((upload) => {
      expect(upload).toHaveTextContent("No image");
    });
  });

  it("renders correctly with default images", () => {
    const defaultImages = [
      { image: "image1", imageOrderId: 1 },
      { image: "image2", imageOrderId: 2 },
    ];

    render(<ShowcaseFormImagesComponent defaultImages={defaultImages} />);

    // First two should have images
    expect(screen.getByTestId("image-upload-1")).toHaveTextContent(
      "Image: image1",
    );
    expect(screen.getByTestId("image-upload-2")).toHaveTextContent(
      "Image: image2",
    );

    // Last two should not have images
    expect(screen.getByTestId("image-upload-3")).toHaveTextContent("No image");
    expect(screen.getByTestId("image-upload-4")).toHaveTextContent("No image");
  });

  it("passes correct imageOrderId to each component", () => {
    const defaultImages = [
      { image: "image1", imageOrderId: 2 },
      { image: "image2", imageOrderId: 4 },
    ];

    render(<ShowcaseFormImagesComponent defaultImages={defaultImages} />);

    // Should use the imageOrderId from the provided default images
    expect(screen.getByTestId("image-upload-2")).toHaveTextContent(
      "Image: image1",
    );
    expect(screen.getByTestId("image-upload-4")).toHaveTextContent(
      "Image: image2",
    );

    // Other components should use their index as imageOrderNumber
    expect(screen.getByTestId("image-upload-2")).toBeInTheDocument();
    expect(screen.getByTestId("image-upload-3")).toBeInTheDocument();
  });

  it("renders exactly MAX_IMAGES (4) upload components", () => {
    // Test with more images than allowed to ensure it still renders only MAX_IMAGES
    const manyImages = [
      { image: "image1", imageOrderId: 1 },
      { image: "image2", imageOrderId: 2 },
      { image: "image3", imageOrderId: 3 },
      { image: "image4", imageOrderId: 4 },
      { image: "image5", imageOrderId: 5 }, // This should be ignored
    ];

    render(<ShowcaseFormImagesComponent defaultImages={manyImages} />);

    const imageUploads = screen.getAllByTestId(/image-upload-\d/);
    expect(imageUploads).toHaveLength(4); // Should always be MAX_IMAGES (4)
  });
});
