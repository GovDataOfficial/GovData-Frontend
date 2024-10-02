import { FocusEvent, KeyboardEvent, useId, useRef, useState } from "react";
import { useOutsideClick } from "@/app/_lib/hooks/useOutsideClick";

export function useDropDown() {
  const dropDownId = useId();

  const [isOpen, setIsOpen] = useState(false);

  const openMenu = function () {
    setIsOpen(true);
  };

  const closeMenu = function () {
    setIsOpen(false);
  };

  const dropdownRef = useOutsideClick(closeMenu);
  const dropdownToggleRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuRef = useRef<HTMLUListElement>(null);

  const closeMenuOnEscape = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "Escape") {
      closeMenu();
      dropdownToggleRef.current?.focus();
    }
  };

  const closeMenuOnBlur = (event: FocusEvent) => {
    if (!dropdownRef.current?.contains(event.relatedTarget)) {
      closeMenu();
    }
  };

  return {
    dropdownRef,
    closeMenuOnBlur,
    dropdownToggleRef,
    dropdownMenuRef,
    closeMenuOnEscape,
    dropDownId,
    isOpen,
    closeMenu,
    openMenu,
  };
}
