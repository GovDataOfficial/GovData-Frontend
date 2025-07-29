"use client";

import { PropsWithChildren } from "react";

import { ButtonIcon } from "@/app/_components/Button/ButtonIcon";
import { icons } from "@/app/_components/SVG/SVG";
import { useModal } from "@/app/_lib/hooks/useModal";
import { useOutsideClick } from "@/app/_lib/hooks/useOutsideClick";
import { i18n } from "@/i18n";

type ModalProps = PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
}>;

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}: ModalProps) {
  const modalContentClassName = "gd-modal-content";
  const outsideClickRef = useOutsideClick<HTMLDivElement>(onClose);
  const { modalRef } = useModal({
    isOpen,
    onClose,
    modalContentClassName,
  });

  // Combine the refs - use the modal ref for focus management and outside click detection
  const combinedRef = (node: HTMLDivElement) => {
    modalRef.current = node;
    outsideClickRef.current = node;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="gd-modal-backdrop" role="presentation">
      <div
        ref={combinedRef}
        className={`gd-modal ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "gd-modal-title" : undefined}
        tabIndex={-1}
      >
        <div className="gd-modal-header">
          {title && (
            <h1 id="gd-modal-title" className="gd-modal-title">
              {title}
            </h1>
          )}
          <ButtonIcon
            onClick={onClose}
            icon={icons.remove}
            title={i18n.t("modal.close")}
            className="gd-button-icon-tertiary gd-button-a"
            aria-label={i18n.t("modal.close")}
            tooltipPlacement="top"
          />
        </div>
        <div className={modalContentClassName}>{children}</div>
      </div>
    </div>
  );
}
