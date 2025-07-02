import { describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ShowcaseFormImageUpload } from "@/app/datenpflege/anwendungen/_components/ShowcaseForm/imageUpload/ShowcaseFormImageUpload";

describe("ShowcaseFormImageUpload", () => {
  const uploadButtonRef = { current: null };

  it("renders correctly", () => {
    const onImageUpload = vi.fn();
    const { getByText, getByLabelText } = render(
      <ShowcaseFormImageUpload
        onImageUpload={onImageUpload}
        uploadButtonRef={uploadButtonRef}
      />,
    );

    expect(getByText(/Datei auswählen/i)).toBeInTheDocument();
    expect(getByLabelText(/Datei auswählen/i)).toBeInTheDocument();
  });

  it("opens file input when container is clicked", async () => {
    const user = userEvent.setup();
    const onImageUpload = vi.fn();
    const { getByRole, container } = render(
      <ShowcaseFormImageUpload
        onImageUpload={onImageUpload}
        uploadButtonRef={uploadButtonRef}
      />,
    );

    const button = getByRole("button");
    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click");

    await user.click(button);
    expect(clickSpy).toHaveBeenCalled();
  });

  it("opens file input on Enter key press", async () => {
    const user = userEvent.setup();
    const onImageUpload = vi.fn();
    const { getByRole, container } = render(
      <ShowcaseFormImageUpload
        onImageUpload={onImageUpload}
        uploadButtonRef={uploadButtonRef}
      />,
    );

    const button = getByRole("button");
    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click");

    // Focus the button directly instead of using tab
    button.focus();
    await user.keyboard("{Enter}");
    expect(clickSpy).toHaveBeenCalled();
  });

  it("opens file input on Space key press", async () => {
    const user = userEvent.setup();
    const onImageUpload = vi.fn();
    const { getByRole, container } = render(
      <ShowcaseFormImageUpload
        onImageUpload={onImageUpload}
        uploadButtonRef={uploadButtonRef}
      />,
    );

    const button = getByRole("button");
    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click");

    // Focus the button directly instead of using tab
    button.focus();
    await user.keyboard(" ");
    expect(clickSpy).toHaveBeenCalled();
  });

  it("calls onImageUpload when a file is selected", async () => {
    const user = userEvent.setup();
    const onImageUpload = vi.fn();
    const { container } = render(
      <ShowcaseFormImageUpload
        onImageUpload={onImageUpload}
        uploadButtonRef={uploadButtonRef}
      />,
    );

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });

    await user.upload(fileInput, file);
    expect(onImageUpload).toHaveBeenCalledWith(file);
  });

  it("does not call onImageUpload when no file is selected", async () => {
    const user = userEvent.setup();
    const onImageUpload = vi.fn();
    const { container } = render(
      <ShowcaseFormImageUpload
        onImageUpload={onImageUpload}
        uploadButtonRef={uploadButtonRef}
      />,
    );

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    // This simulates a file dialog being canceled (no files selected)
    await user.upload(fileInput, []);
    expect(onImageUpload).not.toHaveBeenCalled();
  });

  it("prevents default on button click", async () => {
    const user = userEvent.setup();
    const onImageUpload = vi.fn();

    const { container } = render(
      <ShowcaseFormImageUpload
        onImageUpload={onImageUpload}
        uploadButtonRef={uploadButtonRef}
      />,
    );

    const button = container.querySelector(".gd-button") as HTMLButtonElement;

    const originalPreventDefault = Event.prototype.preventDefault;
    const preventDefaultSpy = vi.fn();
    Event.prototype.preventDefault = preventDefaultSpy;

    try {
      await user.click(button);
      expect(preventDefaultSpy).toHaveBeenCalled();
    } finally {
      Event.prototype.preventDefault = originalPreventDefault;
    }
  });

  it("shows error message when onImageUpload throws an error", async () => {
    const user = userEvent.setup();
    const mockError = new Error("Upload failed");
    const onImageUpload = vi.fn().mockRejectedValue(mockError);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { container, getByText } = render(
      <ShowcaseFormImageUpload
        onImageUpload={onImageUpload}
        uploadButtonRef={uploadButtonRef}
      />,
    );

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });

    // Upload a file that will trigger an error
    await user.upload(fileInput, file);

    // Verify error handling
    expect(onImageUpload).toHaveBeenCalledWith(file);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error handling file selection:",
      mockError,
    );

    // Verify error message is displayed
    expect(
      getByText(/Beim Laden des Bildes ist ein Fehler aufgetreten/i),
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it("clears error state when a new file is successfully uploaded", async () => {
    const user = userEvent.setup();
    const onImageUpload = vi
      .fn()
      .mockRejectedValueOnce(new Error("First upload failed"))
      .mockResolvedValueOnce(undefined);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { container, getByText, queryByText } = render(
      <ShowcaseFormImageUpload
        onImageUpload={onImageUpload}
        uploadButtonRef={uploadButtonRef}
      />,
    );

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file1 = new File(["dummy content"], "fail.png", {
      type: "image/png",
    });
    const file2 = new File(["dummy content"], "success.png", {
      type: "image/png",
    });

    // First upload - should fail
    await user.upload(fileInput, file1);
    expect(
      getByText(/Beim Laden des Bildes ist ein Fehler aufgetreten/i),
    ).toBeInTheDocument();

    // Second upload - should succeed and clear error
    await user.upload(fileInput, file2);
    expect(
      queryByText(/Beim Laden des Bildes ist ein Fehler aufgetreten/i),
    ).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it("handles empty file selection gracefully", async () => {
    const user = userEvent.setup();
    const onImageUpload = vi.fn();

    const { container, queryByText } = render(
      <ShowcaseFormImageUpload
        onImageUpload={onImageUpload}
        uploadButtonRef={uploadButtonRef}
      />,
    );

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    // Simulate canceling file dialog (empty file list)
    await user.upload(fileInput, []);

    // Should not call onImageUpload and should not show an error
    expect(onImageUpload).not.toHaveBeenCalled();
    expect(
      queryByText(/Beim Laden des Bildes ist ein Fehler aufgetreten/i),
    ).not.toBeInTheDocument();
  });
});
