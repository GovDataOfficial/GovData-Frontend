"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";

export type MenuItemMobile = {
  href: string;
  name: string;
  color?: string;
  subMenu?: MenuItemMobile[];
};

export function MenuItemMobile({ href, name, subMenu }: MenuItemMobile) {
  const ref = useRef<HTMLLIElement>(null);
  const path = usePathname();
  const isActive = path === href || path.startsWith(href + "/");
  const hasSubMenu = Array.isArray(subMenu) && subMenu.length > 0;
  const linkClasses = [];

  if (isActive) {
    linkClasses.push("selected");
  }

  function toggle() {
    ref.current?.classList.toggle("open");
  }

  if (hasSubMenu) {
    linkClasses.push("dropdown-toggle");
    return (
      <li ref={ref} className="dropdown" role="presentation">
        <button
          onClick={toggle}
          className={linkClasses.join(" ")}
          title={name}
          role="menuitem"
        >
          {name}
        </button>

        <ul className="child-menu" role="menu">
          {subMenu.map((data) => (
            <MenuItemMobile key={data.name} {...data} />
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li role="presentation">
      <a
        href={href}
        role="menuitem"
        title={name}
        className={linkClasses.join(" ")}
      >
        {name}
      </a>
    </li>
  );
}
