import { ReactNode } from "react";
import { useDropDown } from "@/app/_components/Dropdown/useDropDown";

type Dropdown<T> = {
  options: T[];
  title: string;
  label: string;
  children: (item: T) => ReactNode;
};

export function DropdownSelect<T>({
  options,
  title,
  label,
  children,
}: Dropdown<T>) {
  const {
    dropdownRef,
    closeMenuOnBlur,
    dropdownToggleRef,
    dropdownMenuRef,
    closeMenuOnEscape,
    dropDownId,
    isOpen,
    closeMenu,
    openMenu,
  } = useDropDown();

  return (
    <div
      className="gd-dropdown gd-dropdown-select"
      ref={dropdownRef}
      onBlur={closeMenuOnBlur}
    >
      <span className="gd-dropdown-select-label">{label}</span>
      <button
        ref={dropdownToggleRef}
        aria-haspopup="true"
        aria-controls={dropDownId}
        aria-expanded={isOpen}
        type="button"
        className="gd-dropdown-toggle"
        onClick={isOpen ? closeMenu : openMenu}
      >
        <span>{title}</span>
      </button>
      <ul
        id={dropDownId}
        ref={dropdownMenuRef}
        className={`gd-dropdown-menu ${isOpen ? "open" : ""}`}
        aria-hidden={!isOpen}
        onKeyDown={closeMenuOnEscape}
      >
        {options.map((option, index) => (
          <li key={index}>{children(option)}</li>
        ))}
      </ul>
    </div>
  );
}
