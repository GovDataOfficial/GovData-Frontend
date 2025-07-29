import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MetadataPreviewModal } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewModal";

// Mock the Modal component
vi.mock("@/app/_components/Modal/Modal", () => ({
  Modal: vi.fn(({ isOpen, onClose, title, children }) => {
    if (!isOpen) {
      return null;
    }
    return (
      <div data-testid="modal">
        <div data-testid="modal-title">{title}</div>
        <button data-testid="modal-close" onClick={onClose}>
          Close Modal
        </button>
        <div data-testid="modal-content">{children}</div>
      </div>
    );
  }),
}));

// Mock the MetadataPreviewModalContent component
vi.mock(
  "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewModalContent",
  () => ({
    MetadataPreviewModalContent: vi.fn(({ metadataName }) => (
      <div data-testid="metadata-preview-modal-content">
        <span data-testid="metadata-name">{metadataName}</span>
      </div>
    )),
  }),
);

describe("MetadataPreviewModal", () => {
  const defaultProps = {
    metadataName: "test-metadata-name",
    backendUrl: "http://example.com/metadata",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial render", () => {
    it("renders the trigger button with correct text", () => {
      render(<MetadataPreviewModal {...defaultProps} />);

      const triggerButton = screen.getByRole("button", {
        name: "Vorschau und Download",
      });
      expect(triggerButton).toBeInTheDocument();
    });

    it("does not render modal initially", () => {
      render(<MetadataPreviewModal {...defaultProps} />);

      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  describe("Modal opening and closing", () => {
    it("opens modal when trigger button is clicked", async () => {
      const user = userEvent.setup();
      render(<MetadataPreviewModal {...defaultProps} />);

      const triggerButton = screen.getByRole("button", {
        name: "Vorschau und Download",
      });

      await user.click(triggerButton);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("closes modal when close button is clicked", async () => {
      const user = userEvent.setup();
      render(<MetadataPreviewModal {...defaultProps} />);

      // Open modal
      const triggerButton = screen.getByRole("button", {
        name: "Vorschau und Download",
      });
      await user.click(triggerButton);

      expect(screen.getByTestId("modal")).toBeInTheDocument();

      // Close modal
      const closeButton = screen.getByTestId("modal-close");
      await user.click(closeButton);

      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("can open and close modal multiple times", async () => {
      const user = userEvent.setup();
      render(<MetadataPreviewModal {...defaultProps} />);

      const triggerButton = screen.getByRole("button", {
        name: "Vorschau und Download",
      });

      // First cycle
      await user.click(triggerButton);
      expect(screen.getByTestId("modal")).toBeInTheDocument();

      let closeButton = screen.getByTestId("modal-close");
      await user.click(closeButton);
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();

      // Second cycle
      await user.click(triggerButton);
      expect(screen.getByTestId("modal")).toBeInTheDocument();

      closeButton = screen.getByTestId("modal-close");
      await user.click(closeButton);
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  describe("Modal title", () => {
    it("displays correct modal title when opened", async () => {
      const user = userEvent.setup();
      render(<MetadataPreviewModal {...defaultProps} />);

      const triggerButton = screen.getByRole("button", {
        name: "Vorschau und Download",
      });
      await user.click(triggerButton);

      const modalTitle = screen.getByTestId("modal-title");
      expect(modalTitle).toHaveTextContent("Metadaten-Vorschau");
    });
  });

  describe("Modal content", () => {
    it("renders MetadataPreviewModalContent with correct props when modal is open", async () => {
      const user = userEvent.setup();
      render(<MetadataPreviewModal {...defaultProps} />);

      const triggerButton = screen.getByRole("button", {
        name: "Vorschau und Download",
      });
      await user.click(triggerButton);

      expect(
        screen.getByTestId("metadata-preview-modal-content"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("metadata-name")).toHaveTextContent(
        "test-metadata-name",
      );
    });
  });
});
