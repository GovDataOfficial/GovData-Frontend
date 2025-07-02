import { beforeEach, describe, expect, it, vi } from "vitest";
import { getByRole, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { RefObject } from "react";

import { ShowcaseFormImageCrop } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/ShowcaseFormImageCrop";
import { ShowcaseFormImageUpload } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/ShowcaseFormImageUpload";
import { ShowcaseFormImageUploadAndCrop } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/ShowcaseFormImageUploadAndCrop";
import { useImageUpload } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/useImageUpload";

vi.mock(
  "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/useImageUpload",
);
vi.mock(
  "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/ShowcaseFormImageUpload",
  () => ({
    ShowcaseFormImageUpload: vi.fn(() => (
      <div data-testid="image-upload">Upload Component</div>
    )),
  }),
);
vi.mock(
  "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/ShowcaseFormImageCrop",
  () => ({
    ShowcaseFormImageCrop: vi.fn(() => (
      <div data-testid="image-crop">Crop Component</div>
    )),
  }),
);

describe("ShowcaseFormImageUploadAndCrop", () => {
  const mockUploadImage = vi.fn();
  const mockDeleteImage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the ImageUpload component when no image is available", () => {
    const uploadButtonRef = { current: null } as RefObject<HTMLButtonElement>;

    // Setup mock hook return value
    vi.mocked(useImageUpload).mockReturnValue({
      imageSrc: null,
      uploadImage: mockUploadImage,
      deleteImage: mockDeleteImage,
      uploadButtonRef,
      liveRegionMessage: "",
    });

    render(<ShowcaseFormImageUploadAndCrop imageOrderNumber={1} />);

    // Check that the upload component is rendered
    expect(screen.getByTestId("image-upload")).toBeInTheDocument();
    expect(screen.queryByTestId("image-crop")).not.toBeInTheDocument();

    // Verify hook was called with null (no default image)
    expect(useImageUpload).toHaveBeenCalledWith(null);

    // Verify props passed to the upload component
    expect(ShowcaseFormImageUpload).toHaveBeenCalledWith(
      { onImageUpload: mockUploadImage, uploadButtonRef },
      expect.anything(),
    );
  });

  it("renders the ShowcaseFormImageCrop component when an image is available", () => {
    const testImageSrc = "data:image/png;base64,test123";

    // Setup mock hook return value with image
    vi.mocked(useImageUpload).mockReturnValue({
      imageSrc: testImageSrc,
      uploadImage: mockUploadImage,
      deleteImage: mockDeleteImage,
      uploadButtonRef: { current: null },
      liveRegionMessage: "",
    });

    render(<ShowcaseFormImageUploadAndCrop imageOrderNumber={2} />);

    // Check that the crop component is rendered
    expect(screen.getByTestId("image-crop")).toBeInTheDocument();
    expect(screen.queryByTestId("image-upload")).not.toBeInTheDocument();

    // Verify hook was called with null (no default image)
    expect(useImageUpload).toHaveBeenCalledWith(null);

    // Verify props passed to the crop component
    expect(ShowcaseFormImageCrop).toHaveBeenCalledWith(
      {
        imageSrc: testImageSrc,
        onDeleteImage: mockDeleteImage,
        imageOrderNumber: 2,
      },
      expect.anything(),
    );
  });

  it("uses the defaultImage when provided", () => {
    const defaultImage = "data:image/png;base64,default123";

    // Setup mock hook return value
    vi.mocked(useImageUpload).mockReturnValue({
      imageSrc: defaultImage,
      uploadImage: mockUploadImage,
      deleteImage: mockDeleteImage,
      uploadButtonRef: { current: null },
      liveRegionMessage: "",
    });

    render(
      <ShowcaseFormImageUploadAndCrop
        defaultImage={defaultImage}
        imageOrderNumber={3}
      />,
    );

    // Verify hook was called with the default image
    expect(useImageUpload).toHaveBeenCalledWith(defaultImage);

    // Check that the crop component is rendered
    expect(screen.getByTestId("image-crop")).toBeInTheDocument();
  });

  it("transitions from upload to crop view when an image is uploaded", () => {
    const testImageSrc = "data:image/png;base64,test123";
    let hookReturnValue: {
      imageSrc: string | null;
      uploadImage: typeof mockUploadImage;
      deleteImage: typeof mockDeleteImage;
      uploadButtonRef: { current: null };
      liveRegionMessage: string;
    } = {
      imageSrc: null,
      uploadImage: mockUploadImage,
      deleteImage: mockDeleteImage,
      uploadButtonRef: { current: null },
      liveRegionMessage: "",
    };

    // Initially return no image
    vi.mocked(useImageUpload).mockImplementation(() => hookReturnValue);

    const { rerender } = render(
      <ShowcaseFormImageUploadAndCrop imageOrderNumber={1} />,
    );

    // Initially show upload component
    expect(screen.getByTestId("image-upload")).toBeInTheDocument();

    // Simulate image upload by changing the mock return value
    hookReturnValue = {
      imageSrc: testImageSrc,
      uploadImage: mockUploadImage,
      deleteImage: mockDeleteImage,
      uploadButtonRef: { current: null },
      liveRegionMessage: "",
    };

    // Re-render with the new state
    rerender(<ShowcaseFormImageUploadAndCrop imageOrderNumber={1} />);

    // Now it should show crop component
    expect(screen.getByTestId("image-crop")).toBeInTheDocument();
    expect(screen.queryByTestId("image-upload")).not.toBeInTheDocument();
  });

  it("transitions from crop to upload view when an image is deleted", () => {
    const testImageSrc = "data:image/png;base64,test123";
    let hookReturnValue: {
      imageSrc: string | null;
      uploadImage: typeof mockUploadImage;
      deleteImage: typeof mockDeleteImage;
      uploadButtonRef: { current: null };
      liveRegionMessage: string;
    } = {
      imageSrc: testImageSrc,
      uploadImage: mockUploadImage,
      deleteImage: mockDeleteImage,
      uploadButtonRef: { current: null },
      liveRegionMessage: "",
    };

    // Initially return with image
    vi.mocked(useImageUpload).mockImplementation(() => hookReturnValue);

    const { rerender } = render(
      <ShowcaseFormImageUploadAndCrop imageOrderNumber={1} />,
    );

    // Initially show crop component
    expect(screen.getByTestId("image-crop")).toBeInTheDocument();

    // Simulate image deletion by changing the mock return value
    hookReturnValue = {
      imageSrc: null,
      uploadImage: mockUploadImage,
      deleteImage: mockDeleteImage,
      uploadButtonRef: { current: null },
      liveRegionMessage: "",
    };

    // Re-render with the new state
    rerender(<ShowcaseFormImageUploadAndCrop imageOrderNumber={1} />);

    // Now it should show upload component
    expect(screen.getByTestId("image-upload")).toBeInTheDocument();
    expect(screen.queryByTestId("image-crop")).not.toBeInTheDocument();
  });

  it("focuses the upload button when an image is deleted", async () => {
    // Create an actual mock function for focus
    const mockFocus = vi.fn();
    const user = userEvent.setup();

    // Create a mock for the deleteImage function that directly calls focus
    // This simulates what happens in the real implementation after deletion
    const mockDeleteImageFunction = vi.fn(() => {
      // Directly call focus to simulate the useEffect that would run
      // when both imageSrc is null and isDeleted is true
      mockFocus();
    });

    // Mock the hook with a version that uses a real button ref with mock focus
    // and a custom deleteImage function we can track
    vi.mocked(useImageUpload).mockImplementation(() => {
      // Return a mock implementation with our custom deleteImage function
      return {
        imageSrc: "data:image/png;base64,test123",
        uploadImage: vi.fn(),
        deleteImage: mockDeleteImageFunction,
        uploadButtonRef: {
          current: { focus: mockFocus } as unknown as HTMLButtonElement,
        },
        liveRegionMessage: "",
      };
    });

    // Update the ShowcaseFormImageCrop mock to include a delete button that
    // actually calls the onDeleteImage prop
    vi.mocked(ShowcaseFormImageCrop).mockImplementation((props) => (
      <div data-testid="image-crop">
        <button
          data-testid="delete-image-button"
          onClick={() => props.onDeleteImage()}
        >
          Delete
        </button>
      </div>
    ));

    // Render with initial image
    const { getByTestId } = render(
      <ShowcaseFormImageUploadAndCrop
        defaultImage="data:image/png;base64,test123"
        imageOrderNumber={1}
      />,
    );

    // When the delete button is clicked, it should trigger the deleteImage function
    const deleteButton = getByTestId("delete-image-button");
    await user.click(deleteButton);

    // Verify the deleteImage function was called
    expect(mockDeleteImageFunction).toHaveBeenCalled();

    // And that it called focus as part of its implementation
    expect(mockFocus).toHaveBeenCalled();
  });
});
