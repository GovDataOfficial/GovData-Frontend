import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Modal } from "@/app/_components/Modal/Modal";

// Mock the ButtonIcon component
vi.mock("@/app/_components/Button/ButtonIcon", () => ({
  ButtonIcon: vi.fn(({ onClick, title, "aria-label": ariaLabel, ...props }) => (
    <button
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      data-testid="close-button"
    >
      Close
    </button>
  )),
}));

// Mock the useOutsideClick hook
vi.mock("@/app/_lib/hooks/useOutsideClick", () => ({
  useOutsideClick: vi.fn(() => ({ current: null })),
}));

describe("Modal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Visibility and rendering", () => {
    it("renders modal when isOpen is true", () => {
      render(<Modal {...defaultProps}>Test content</Modal>);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("does not render modal when isOpen is false", () => {
      render(
        <Modal {...defaultProps} isOpen={false}>
          Test content
        </Modal>,
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.queryByText("Test content")).not.toBeInTheDocument();
    });

    it("renders children content correctly", () => {
      const complexContent = (
        <div>
          <h2>Complex Content</h2>
          <p>This is a paragraph</p>
          <button>Action Button</button>
        </div>
      );

      render(<Modal {...defaultProps}>{complexContent}</Modal>);

      expect(screen.getByText("Complex Content")).toBeInTheDocument();
      expect(screen.getByText("This is a paragraph")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Action Button" }),
      ).toBeInTheDocument();
    });
  });

  describe("Title handling", () => {
    it("renders title when provided", () => {
      render(
        <Modal {...defaultProps} title="Test Modal Title">
          Content
        </Modal>,
      );

      const title = screen.getByText("Test Modal Title");
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute("id", "gd-modal-title");
    });

    it("does not render title element when title is not provided", () => {
      render(<Modal {...defaultProps}>Content</Modal>);

      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
      expect(document.querySelector("#gd-modal-title")).not.toBeInTheDocument();
    });

    it("renders empty title correctly", () => {
      render(
        <Modal {...defaultProps} title="">
          Content
        </Modal>,
      );

      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });

  describe("Close functionality", () => {
    it("renders close button", () => {
      render(<Modal {...defaultProps}>Content</Modal>);

      const closeButton = screen.getByTestId("close-button");
      expect(closeButton).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <Modal {...defaultProps} onClose={onClose}>
          Content
        </Modal>,
      );

      const closeButton = screen.getByTestId("close-button");
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("close button has correct title from translation", () => {
      render(<Modal {...defaultProps}>Content</Modal>);

      const closeButton = screen.getByTestId("close-button");
      expect(closeButton).toHaveAttribute("title", "Dialog schließen");
    });

    it("close button has correct aria-label from translation", () => {
      render(<Modal {...defaultProps}>Content</Modal>);

      const closeButton = screen.getByTestId("close-button");
      expect(closeButton).toHaveAttribute("aria-label", "Dialog schließen");
    });
  });

  describe("Keyboard interactions", () => {
    it("handles escape key press on close button", () => {
      render(<Modal {...defaultProps}>Content</Modal>);

      const closeButton = screen.getByTestId("close-button");
      fireEvent.keyDown(closeButton, { key: "Escape", code: "Escape" });

      // The useModal hook would handle the escape key, not the button directly
      // This test verifies the button doesn't interfere with keyboard events
      expect(closeButton).toBeInTheDocument();
    });

    it("handles enter key on close button", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Modal {...defaultProps} onClose={onClose}>
          Content
        </Modal>,
      );

      // Close button should be focused because there are no focusable elements in content
      const closeButton = screen.getByTestId("close-button");
      expect(closeButton).toHaveFocus();

      // Press Enter on the focused button
      await user.keyboard("{Enter}");
      expect(onClose).toHaveBeenCalled();
    });

    it("handles space key on close button", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(
        <Modal {...defaultProps} onClose={onClose}>
          Content
        </Modal>,
      );

      // Close button should be focused because there are no focusable elements in content
      const closeButton = screen.getByTestId("close-button");
      expect(closeButton).toHaveFocus();

      // Press Space on the focused button
      await user.keyboard(" ");
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe("State transitions", () => {
    it("handles isOpen state changes correctly", () => {
      const { rerender } = render(
        <Modal {...defaultProps} isOpen={false}>
          Content
        </Modal>,
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      rerender(
        <Modal {...defaultProps} isOpen={true}>
          Content
        </Modal>,
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      rerender(
        <Modal {...defaultProps} isOpen={false}>
          Content
        </Modal>,
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("handles onClose function changes", () => {
      const onClose1 = vi.fn();
      const onClose2 = vi.fn();

      const { rerender } = render(
        <Modal {...defaultProps} onClose={onClose1}>
          Content
        </Modal>,
      );

      rerender(
        <Modal {...defaultProps} onClose={onClose2}>
          Content
        </Modal>,
      );

      // The modal should re-render with the new onClose function
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("handles content changes", () => {
      const { rerender } = render(
        <Modal {...defaultProps}>Initial content</Modal>,
      );

      expect(screen.getByText("Initial content")).toBeInTheDocument();

      rerender(<Modal {...defaultProps}>Updated content</Modal>);

      expect(screen.queryByText("Initial content")).not.toBeInTheDocument();
      expect(screen.getByText("Updated content")).toBeInTheDocument();
    });
  });

  describe("Error handling", () => {
    it("handles missing required props gracefully", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // This should not crash the component
      expect(() => {
        render(
          <Modal isOpen={true} onClose={undefined as any}>
            Content
          </Modal>,
        );
      }).not.toThrow();

      consoleSpy.mockRestore();
    });

    it("handles invalid children gracefully", () => {
      expect(() => {
        render(<Modal {...defaultProps}>{null}</Modal>);
      }).not.toThrow();

      expect(() => {
        render(<Modal {...defaultProps}>{undefined}</Modal>);
      }).not.toThrow();
    });

    it("handles edge case props", () => {
      expect(() => {
        render(
          <Modal
            isOpen={true}
            onClose={vi.fn()}
            title={null as any}
            className={null as any}
          >
            Content
          </Modal>,
        );
      }).not.toThrow();
    });
  });

  describe("useModal hook integration", () => {
    let originalBodyStyle: string;

    beforeEach(() => {
      originalBodyStyle = document.body.style.overflow;
    });

    afterEach(() => {
      document.body.style.overflow = originalBodyStyle;
    });

    describe("Body scroll management", () => {
      it("locks body scroll when modal opens", () => {
        render(<Modal {...defaultProps}>Content</Modal>);
        expect(document.body.style.overflow).toBe("hidden");
      });

      it("restores body scroll when modal closes", () => {
        const { rerender } = render(<Modal {...defaultProps}>Content</Modal>);
        expect(document.body.style.overflow).toBe("hidden");

        rerender(
          <Modal {...defaultProps} isOpen={false}>
            Content
          </Modal>,
        );
        expect(document.body.style.overflow).toBe("");
      });

      it("restores body scroll on unmount", () => {
        const { unmount } = render(<Modal {...defaultProps}>Content</Modal>);
        expect(document.body.style.overflow).toBe("hidden");

        unmount();
        expect(document.body.style.overflow).toBe("");
      });
    });

    describe("Focus management", () => {
      it("sets initial focus to first focusable element in modal content", async () => {
        render(
          <Modal {...defaultProps}>
            <div className="gd-modal-content">
              <input data-testid="first-input" />
              <button data-testid="second-button">Button</button>
            </div>
          </Modal>,
        );

        // Focus should be set to the first focusable element
        expect(screen.getByTestId("first-input")).toHaveFocus();
      });

      it("focuses close button when no focusable elements in content", async () => {
        render(
          <Modal {...defaultProps}>
            <div className="gd-modal-content">
              <p>Just text content</p>
            </div>
          </Modal>,
        );

        // Focus should be set to the close button
        expect(screen.getByTestId("close-button")).toHaveFocus();
      });

      it("focuses modal container as fallback when no close button", async () => {
        // Mock ButtonIcon to not render anything
        vi.mocked(
          await import("@/app/_components/Button/ButtonIcon"),
        ).ButtonIcon.mockImplementation(() => <></>);

        render(
          <Modal {...defaultProps}>
            <div className="gd-modal-content">
              <p>Just text content</p>
            </div>
          </Modal>,
        );

        // Focus should be set to the modal container
        expect(screen.getByRole("dialog")).toHaveFocus();
      });

      it("restores focus to previously active element when modal closes", async () => {
        const triggerButton = document.createElement("button");
        triggerButton.textContent = "Open Modal";
        document.body.appendChild(triggerButton);
        triggerButton.focus();

        const { rerender } = render(<Modal {...defaultProps}>Content</Modal>);

        // Close button should have focus initially (as fallback)
        expect(screen.getByTestId("close-button")).toHaveFocus();

        rerender(
          <Modal {...defaultProps} isOpen={false}>
            Content
          </Modal>,
        );

        // Focus should be restored to the trigger button
        expect(triggerButton).toHaveFocus();

        // Cleanup
        document.body.removeChild(triggerButton);
      });
    });

    describe("Focus trap", () => {
      it("traps focus within modal using Tab key", async () => {
        const user = userEvent.setup();

        render(
          <Modal {...defaultProps}>
            <div className="gd-modal-content">
              <input data-testid="first-input" />
              <button data-testid="middle-button">Middle</button>
              <input data-testid="last-input" />
            </div>
          </Modal>,
        );

        const firstInput = screen.getByTestId("first-input");
        const middleButton = screen.getByTestId("middle-button");
        const lastInput = screen.getByTestId("last-input");
        const closeButton = screen.getByTestId("close-button");

        // Initial focus should be on first input
        expect(firstInput).toHaveFocus();

        // Tab to middle button
        await user.tab();
        expect(middleButton).toHaveFocus();

        // Tab to last input
        await user.tab();
        expect(lastInput).toHaveFocus();

        // Tab to close button
        await user.tab();
        expect(closeButton).toHaveFocus();

        // Tab should wrap to first input
        await user.tab();
        expect(firstInput).toHaveFocus();
      });

      it("traps focus in reverse using Shift+Tab", async () => {
        const user = userEvent.setup();

        render(
          <Modal {...defaultProps}>
            <div className="gd-modal-content">
              <input data-testid="first-input" />
              <button data-testid="middle-button">Middle</button>
              <input data-testid="last-input" />
            </div>
          </Modal>,
        );

        const firstInput = screen.getByTestId("first-input");
        const middleButton = screen.getByTestId("middle-button");
        const lastInput = screen.getByTestId("last-input");
        const closeButton = screen.getByTestId("close-button");

        // Start from first input and go backwards
        firstInput.focus();
        expect(firstInput).toHaveFocus();

        // Shift+Tab should wrap to close button
        await user.tab({ shift: true });
        expect(closeButton).toHaveFocus();

        // Continue backwards
        await user.tab({ shift: true });
        expect(lastInput).toHaveFocus();

        await user.tab({ shift: true });
        expect(middleButton).toHaveFocus();

        await user.tab({ shift: true });
        expect(firstInput).toHaveFocus();
      });

      it("handles focus trap with only one focusable element", async () => {
        const user = userEvent.setup();

        render(
          <Modal {...defaultProps}>
            <div className="gd-modal-content">
              <p>No focusable content</p>
            </div>
          </Modal>,
        );

        const closeButton = screen.getByTestId("close-button");
        expect(closeButton).toHaveFocus();

        // Tab should stay on the same element
        await user.tab();
        expect(closeButton).toHaveFocus();

        // Shift+Tab should also stay on the same element
        await user.tab({ shift: true });
        expect(closeButton).toHaveFocus();
      });

      it("ignores disabled elements in focus trap", async () => {
        const user = userEvent.setup();

        render(
          <Modal {...defaultProps}>
            <div className="gd-modal-content">
              <input data-testid="first-input" />
              <button disabled data-testid="disabled-button">
                Disabled
              </button>
              <input data-testid="last-input" />
            </div>
          </Modal>,
        );

        const firstInput = screen.getByTestId("first-input");
        const lastInput = screen.getByTestId("last-input");
        const closeButton = screen.getByTestId("close-button");

        expect(firstInput).toHaveFocus();

        // Tab should skip disabled button
        await user.tab();
        expect(lastInput).toHaveFocus();

        await user.tab();
        expect(closeButton).toHaveFocus();

        await user.tab();
        expect(firstInput).toHaveFocus();
      });
    });

    describe("Keyboard interactions", () => {
      it("calls onClose when Escape key is pressed", async () => {
        const user = userEvent.setup();
        const mockOnClose = vi.fn();

        render(
          <Modal {...defaultProps} onClose={mockOnClose}>
            Content
          </Modal>,
        );

        await user.keyboard("{Escape}");
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });

      it("does not call onClose when Escape is pressed and modal is closed", async () => {
        const user = userEvent.setup();
        const mockOnClose = vi.fn();

        render(
          <Modal {...defaultProps} isOpen={false} onClose={mockOnClose}>
            Content
          </Modal>,
        );

        await user.keyboard("{Escape}");
        expect(mockOnClose).not.toHaveBeenCalled();
      });

      it("handles other keyboard events without interfering", async () => {
        const user = userEvent.setup();
        const mockOnClose = vi.fn();

        render(
          <Modal {...defaultProps} onClose={mockOnClose}>
            <div className="gd-modal-content">
              <input data-testid="test-input" />
            </div>
          </Modal>,
        );

        const input = screen.getByTestId("test-input");
        await user.click(input);
        await user.keyboard("Hello World");

        expect(input).toHaveValue("Hello World");
        expect(mockOnClose).not.toHaveBeenCalled();
      });

      it("handles Enter key without closing modal", async () => {
        const user = userEvent.setup();
        const mockOnClose = vi.fn();

        render(
          <Modal {...defaultProps} onClose={mockOnClose}>
            <div className="gd-modal-content">
              <button data-testid="test-button">Test Button</button>
            </div>
          </Modal>,
        );

        const button = screen.getByTestId("test-button");
        await user.click(button);
        await user.keyboard("{Enter}");

        expect(mockOnClose).not.toHaveBeenCalled();
      });
    });

    describe("Event listener management", () => {
      it("adds keydown event listener when modal opens", () => {
        const addEventListenerSpy = vi.spyOn(document, "addEventListener");

        render(<Modal {...defaultProps}>Content</Modal>);

        expect(addEventListenerSpy).toHaveBeenCalledWith(
          "keydown",
          expect.any(Function),
        );
      });

      it("removes keydown event listener when modal closes", () => {
        const removeEventListenerSpy = vi.spyOn(
          document,
          "removeEventListener",
        );

        const { rerender } = render(<Modal {...defaultProps}>Content</Modal>);

        rerender(
          <Modal {...defaultProps} isOpen={false}>
            Content
          </Modal>,
        );

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
          "keydown",
          expect.any(Function),
        );
      });

      it("removes keydown event listener on unmount", () => {
        const removeEventListenerSpy = vi.spyOn(
          document,
          "removeEventListener",
        );

        const { unmount } = render(<Modal {...defaultProps}>Content</Modal>);
        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
          "keydown",
          expect.any(Function),
        );
      });

      it("does not add event listener when modal is initially closed", () => {
        const addEventListenerSpy = vi.spyOn(document, "addEventListener");

        render(
          <Modal {...defaultProps} isOpen={false}>
            Content
          </Modal>,
        );

        expect(addEventListenerSpy).not.toHaveBeenCalledWith(
          "keydown",
          expect.any(Function),
        );
      });
    });

    describe("Edge cases and error handling", () => {
      it("handles modal without ref gracefully", () => {
        // This is more of a safety test - the hook should not crash
        expect(() => {
          render(<Modal {...defaultProps}>Content</Modal>);
        }).not.toThrow();
      });

      it("handles modal with no focusable elements correctly", () => {
        render(
          <Modal {...defaultProps}>
            <div>
              <div>Just a div</div>
              <span>Just a span</span>
            </div>
          </Modal>,
        );

        // Should focus the close button as fallback
        expect(screen.getByTestId("close-button")).toHaveFocus();
      });

      it("handles modal with elements that have negative tabindex", async () => {
        const user = userEvent.setup();

        render(
          <Modal {...defaultProps}>
            <div>
              <input data-testid="focusable-input" />
              <button tabIndex={-1} data-testid="non-focusable-button">
                Non-focusable
              </button>
              <input data-testid="last-focusable" />
            </div>
          </Modal>,
        );

        const firstInput = screen.getByTestId("focusable-input");
        const lastInput = screen.getByTestId("last-focusable");
        const closeButton = screen.getByTestId("close-button");

        expect(firstInput).toHaveFocus();

        // Tab should skip element with tabindex="-1"
        await user.tab();
        expect(lastInput).toHaveFocus();

        await user.tab();
        expect(closeButton).toHaveFocus();
      });
    });
  });
});
