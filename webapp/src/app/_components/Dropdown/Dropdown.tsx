import { ReactNode } from "react";
import { useDropDown } from "@/app/_components/Dropdown/useDropDown";

type Dropdown<T> = {
  options: T[];
  title: ReactNode;
  children: (item: T) => ReactNode;
};

export function Dropdown<T>({ options, title, children }: Dropdown<T>) {
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
    <div className="gd-dropdown" ref={dropdownRef} onBlur={closeMenuOnBlur}>
      <button
        ref={dropdownToggleRef}
        aria-haspopup="true"
        aria-controls={dropDownId}
        aria-expanded={isOpen}
        data-dropdown="gd-dropdown-menu"
        type="button"
        className="gd-dropdown-toggle"
        onClick={isOpen ? closeMenu : openMenu}
      >
        {title}
      </button>
      <ul
        ref={dropdownMenuRef}
        id={dropDownId}
        className={`gd-dropdown-menu ${isOpen ? "open" : ""}`}
        aria-hidden={!isOpen}
        aria-label="Filter Optionen"
        onKeyDown={closeMenuOnEscape}
      >
        {options.map((option, index) => (
          <li key={index}>{children(option)}</li>
        ))}
      </ul>
    </div>
  );
}
