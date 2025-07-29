import { useCallback, useEffect, useRef } from "react";

interface UseModalOptions {
  isOpen: boolean;
  onClose: () => void;
  modalContentClassName?: string;
}

// Constants for repeated selectors
const FOCUSABLE_ELEMENTS_SELECTOR =
  'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
const CLOSE_BUTTON_SELECTOR = ".gd-modal-header button";

export function useModal({
  isOpen,
  onClose,
  modalContentClassName = "gd-modal-content",
}: UseModalOptions) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Helper function to get focusable elements
  const getFocusableElements = useCallback((container: HTMLElement) => {
    return Array.from(
      container.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR),
    ) as HTMLElement[];
  }, []);

  // Helper function to manage body scroll
  const setBodyScroll = useCallback((locked: boolean) => {
    document.body.style.overflow = locked ? "hidden" : "";
  }, []);

  // Helper function to set initial focus
  const setInitialFocus = useCallback(() => {
    if (!modalRef.current) {
      return;
    }

    // Try content elements first
    const modalContent = modalRef.current.querySelector(
      `.${modalContentClassName}`,
    );
    if (modalContent) {
      const contentFocusableElements = getFocusableElements(
        modalContent as HTMLElement,
      );
      if (contentFocusableElements.length > 0) {
        contentFocusableElements[0].focus();
        return;
      }
    }

    // Fallback to close button
    const closeButton = modalRef.current.querySelector(
      CLOSE_BUTTON_SELECTOR,
    ) as HTMLElement;
    if (closeButton) {
      closeButton.focus();
      return;
    }

    // Final fallback to modal container
    modalRef.current.focus();
  }, [modalContentClassName, getFocusableElements]);

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen || !modalRef.current) {
        return;
      }

      if (event.key === "Escape") {
        onClose();
        return;
      }

      // Focus trap for Tab key
      if (event.key === "Tab") {
        const focusableElements = getFocusableElements(modalRef.current);
        if (focusableElements.length === 0) {
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const currentElement = document.activeElement;

        if (event.shiftKey && currentElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && currentElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [isOpen, onClose, getFocusableElements],
  );

  // Main effect for modal state management
  useEffect(() => {
    if (isOpen) {
      // Store current focus and setup modal
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.addEventListener("keydown", handleKeyDown);
      setBodyScroll(true);
      setInitialFocus();
    } else {
      // Restore previous state
      setBodyScroll(false);
      previousActiveElement.current?.focus();
    }

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      setBodyScroll(false);
    };
  }, [isOpen, handleKeyDown, setBodyScroll, setInitialFocus]);

  return {
    modalRef,
  };
}
